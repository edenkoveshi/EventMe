//const DB = require('../data/DB')
const eventDAO = require('./eventDAO');
const userDAO = require('./userDAO');
let Event = require('./event');
//const us = require('./userService');
let Poll=require('./poll');



class eventService {
    save_edited_event(eventId, title ,location, type, info, time){
        console.log("---------------save_edited_event-----------------");
        console.log(eventId);
        return new Promise((resolve, reject) => {
            eventDAO.get_event(eventId).then(event=>{
                if(event.length > 0){
                    console.log("event found");
                    event[0].eventId = eventId;
                    event[0].title = title;
                    event[0].location = location;
                    event[0].type = type;
                    event[0].information = info;
                    event[0].time = time;
                    eventDAO.update_event(event[0].eventId, event[0]).then(_=>{
                        resolve()
                    })
                }
                else
                {
                    console.log("couldnt find the event")
                }
            }).catch(err=> reject(err))
        });
    }

    addOpenEvent(owner_id, title ,location, type, info, time, body) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(owner_id).then(own_user=>{
                console.log('-----addOpenEvent-----');
                own_user[0].created_events+=1;
                let event_id = owner_id + own_user[0].created_events;
                let friends_list_name = [];
                let active_friends_id_list = [];
                let promises = [];
                let counter = 0;
                for (let i = 0; i < own_user[0].friends_list.length ; i++)
                {
                    console.log('trying to add the user');
                    console.log(own_user[0].friends_list[i]);
                    promises.push(userDAO.get_User_by_fb_id(own_user[0].friends_list[i]).then(friend=>{
                        if(friend.length > 0)
                        {
                            console.log('going to add a friend name');
                            console.log(friend[0].f_name);
                            console.log(counter);
                            friends_list_name[counter] = (friend[0].f_name);
                            active_friends_id_list[counter] = (friend[0].fb_id);
                            console.log('friends_list_name[counter] = ', friends_list_name[counter]);
                            counter++
                        }
                    }))

                }
                let polls = [];
                let current_poll;
                let question;
                let options;
                let length;
                for (let poll_counter = 0; poll_counter < parseInt(body['poll_counter']);poll_counter++)
                {
                    current_poll ='poll'+(poll_counter+1);
                    console.log("current_poll "+current_poll);
                    question=body[current_poll+'_question'];
                    options=JSON.parse(body[current_poll]);
                    length=parseInt(body[current_poll+'_length']);
                    polls[poll_counter] =new Poll(owner_id ,question ,options ,length, event_id);
                    console.log('entered a new poll');
                    console.log(polls[poll_counter])
                }

                Promise.all(promises).then(_=>{
                    console.log('addOpenEvent - all promises came back');
                    let new_event = new Event(event_id, owner_id, title, location, type, info, time, active_friends_id_list, own_user[0].f_name, friends_list_name,body['poll_counter'],polls);
                    console.log('the new event is:');
                    console.log(new_event);
                    eventDAO.create_event(new_event)
                        .then(_=>{
                            own_user[0].own_public_events.push(event_id);
                            own_user[0].going_events.push(event_id);
                            userDAO.update_user(own_user[0].fb_id, own_user[0]);
                            invite_users_to_my_open_event(event_id, own_user[0].friends_list);
                            resolve()
                        }).catch(err => reject(err))
                }).catch(err=> reject(err))

                })

        })
    }
    delete_my_event(event_id, user_id){
        console.log('--------delete_my_event--------');
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id).then(user=>{
                let do_i_own_this_event = user[0].own_public_events.indexOf(event_id);
                if(do_i_own_this_event > -1)
                {
                    console.log('delete_my_event - geting the event');
                    eventDAO.get_event(event_id).then(event=>{
                        let promises = [];
                        let a_promise;
                        a_promise = remove_my_owned_event_from_my_list(user[0],do_i_own_this_event, event_id);
                        promises.push(a_promise);
                        for (let i = 0; i < event[0].going_users.length ; i++)
                        {
                            if(event[0].going_users[i] != user[0].fb_id)
                            {
                                a_promise = remove_attending_event_from_my_list(event[0].going_users[i],event_id);
                                promises.push(a_promise)
                            }
                        }
                        for (let j = 0; j < event[0].invited_users.length ; j++)
                        {
                            a_promise = remove_invited_users_event_from_my_list(event[0].invited_users[j],event_id);
                            promises.push(a_promise)
                        }
                        a_promise =eventDAO.remove_event(event_id);
                        promises.push(a_promise);
                        Promise.all(promises).then(_=>{
                            resolve()
                        }).catch(err=> reject(err))
                    }).catch(err => reject(err))
                }
                else
                {
                    console.log('delete_my_event - user does not own this event')
                    resolve()
                }
            }).catch(err => reject(err))
        })
    }
    getEvent(event_id) {
        return new Promise((resolve, reject) => {
            eventDAO.get_event(event_id)
                .then(requested_events=> {
                    resolve(requested_events[0])
                }).catch(err => reject(err))
        })
    }

    vote(user_id ,event_id ,cur_pull, my_vote){
        console.log(' -------vote--------');
        return new Promise((resolve, reject) =>{
            eventDAO.get_event(event_id)
                .then(requested_events=>{
                    if(!validate_vote(user_id ,event_id ,cur_pull ,my_vote ,requested_events)){
                        console.log('vote validation failed, vote not counted');
                        resolve()
                    }
                    else
                    {
                        console.log("this is the poll before change:");
                        console.log(requested_events[0].pollArray[cur_pull]);
                        let updated_event = remove_old_votes(requested_events, cur_pull, user_id);
                        console.log("finished removig old votes, now the poll looks like this:");
                        console.log(updated_event[0].pollArray[cur_pull]);
                        for(let i = 0; i<updated_event[0].pollArray[cur_pull].options.length; i++)
                        {
                            if(updated_event[0].pollArray[cur_pull].options[i].option == my_vote)
                            {
                                if(cur_pull == 0){
                                    eventDAO.change_vote0(event_id, user_id, my_vote, i, true)
                                }else if(cur_pull == 1){
                                    eventDAO.change_vote1(event_id, user_id, my_vote, i, true)
                                }else {
                                    eventDAO.change_vote2(event_id, user_id, my_vote, i, true)
                                }
                            }
                        }
                        console.log("finished adding new votes, now the poll looks like this:");
                        console.log(updated_event[0].pollArray[cur_pull]);
                        resolve();
                    }
                }).catch(err => reject(err))
        })
    }

    close_vote(user_id ,event_id ,cur_pull , poll_type){
        console.log ('--------------close_vote---------------');
        return new Promise((resolve, reject) =>{
            eventDAO.get_event(event_id)
                .then(requested_events=>{
                    console.log('requested event:');
                    console.log(requested_events[0]);
                    let winner = {option:0, votes:0};
                    for(let i = 0; i<(requested_events[0].pollArray[cur_pull].options.length); i++)
                    {
                        if(requested_events[0].pollArray[cur_pull].options[i].votes > winner.votes)
                        {
                            winner.option = i;
                            winner.votes = requested_events[0].pollArray[cur_pull].options[i].votes;
                        }
                    }
                    requested_events[0].pollArray[cur_pull].status = "close";   //closing the poll
                    requested_events[0].pollArray[cur_pull].winner = requested_events[0].pollArray[cur_pull].options[winner.option].option;   // saving the winning option to the event

                    // now if poll type is either time or location, update the event accordingly
                    if(poll_type == 'Location')
                    {
                        requested_events[0].location = requested_events[0].pollArray[cur_pull].winner;
                    }
                    else if(poll_type == 'Date-time')
                    {
                        requested_events[0].time = requested_events[0].pollArray[cur_pull].winner;
                    }else
                    {
                        requested_events[0].pool_results = requested_events[0].pollArray[cur_pull].winner;
                    }
                    let j;
                    for(j = cur_pull; j<(requested_events[0].pollArray.length - 1); j++)
                    {
                        requested_events[0].pollArray[j] = requested_events[0].pollArray[j + 1];
                    }
                    requested_events[0].pollArray[j] = {};
                    requested_events[0].pollCounter--;
                    eventDAO.update_event(event_id, requested_events[0]).then(_=>{
                        console.log('closed the poll,  the new event looks like this:');
                        console.log(requested_events[0]);
                        resolve()
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
        })
    }

    remove_all_my_votes(event, my_id){
        console.log("--------remove_all_my_votes--------");
        let res_event = [event];
        for(let i =0; i<event.pollCounter; i++){
            res_event = remove_old_votes(res_event, i, my_id)
        }
        return res_event
    }
}

module.exports = new eventService();

function validate_vote(user_id ,event_id ,cur_pull ,my_vote ,event ){
    console.log('--------validate_vote-------');
    console.log('the data i recieve:');
    console.log(user_id);
    console.log(event_id);
    console.log(cur_pull);
    console.log(my_vote);
    console.log(event);
    let valid_vote = true;
    if(event.length == 0){
        console.log('couldnt find the event');
        return false
    }
    if(event[0].pollArray.length < cur_pull){
        console.log('the '+ cur_pull +'poll was requested, but there are only '+event[0].pollArray.length+' arrays');
        valid_vote= false
    }
    if(event[0].going_users.indexOf(user_id) < 0){
        if(user_id != event[0].ownerId)
        {
            console.log('the user ' + user_id + ' is not going to event ' + event_id);
            valid_vote = false
        }
    }
    let acure = false;
    for(let i = 0; i<event[0].pollArray[cur_pull].options.length; i++){
        if(my_vote == event[0].pollArray[cur_pull].options[i].option){
            console.log("my vote exists");
            acure = true;
        }
    }
    if(!acure){
        console.log('the vote ' + my_vote + ' does not exist ');
        valid_vote = false
    }
    console.log("the vote vlidation  is "+ valid_vote);
    return valid_vote
}

function remove_my_owned_event_from_my_list(user,event_location_in_my_array, event_id){
    console.log('remove_my_owned_event_from_my_list - going to deleting event at owner');
    return new Promise((resolve, reject) => {
        user.own_public_events.splice(event_location_in_my_array,1);
        let am_i_going = user.going_events.indexOf(event_id);
        if(am_i_going > -1)
        {
            user.going_events.splice(am_i_going,1)
        }
        userDAO.update_user(user.fb_id, user).then(_=>{
            console.log('user got his owned event removed');
            resolve()
        }).catch(err => reject(err))
    })
}


function remove_invited_users_event_from_my_list(user_id,event_id){
    console.log('remove_invited_users_event_from_my_list - going to deleting event at invited user');
    console.log(user_id);
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(user_id).then(user=>{
            if(user.length >0){
                user[0].invited_events.splice(user[0].invited_events.indexOf(event_id),1);
                console.log('going to update the next user');
                console.log(user[0]);
                userDAO.update_user(user[0].fb_id, user[0]).then(_=>{
                    resolve()
                }).catch(err => reject(err))
            }
            else
            {
                resolve()
            }

        }).catch(err => reject(err))
    })
}

function remove_attending_event_from_my_list(user_id,event_id){
    console.log('remove_attending_event_from_my_list - going to deleting event at attending user');
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(user_id).then(user=>{
            if(user.length >0){
                user[0].going_events.splice(user[0].going_events.indexOf(event_id),1);
                userDAO.update_user(user[0].fb_id, user[0]).then(_=>{
                    resolve()
                }).catch(err => reject(err))
            }
            else{
                resolve()
            }
        }).catch(err => reject(err))
    })
}

function invite_users_to_my_open_event(event_id, invited_list){

    for(let i=0; i < invited_list.length; i++)
    {
        add_an_event_to_user_invited_list(event_id, invited_list[i])
    }
}

function add_an_event_to_user_invited_list(event_id, user_id){
    userDAO.get_User_by_fb_id(user_id).then(invited_friend=>{
        if (invited_friend.length > 0)
        {
            let updated_events = invited_friend[0].invited_events;
            if(updated_events.indexOf(event_id) < 0 )
            {
                updated_events.push(event_id);
                userDAO.update_invited_events(invited_friend[0].fb_id, updated_events)
            }
        }


    })
}

function remove_old_votes(requested_events, cur_pull, user_id)
{
    console.log("--------remove_old_votes--------")
    //check if the user voted before -> if he did, delete his previos vote
    for(let i = 0; i<requested_events[0].pollArray[cur_pull].voted_users.length; i++){
        if(requested_events[0].pollArray[cur_pull].voted_users[i].user == user_id){
            console.log('the user '+user_id + 'already voted in event ' + requested_events[0].eventId + 'poll '+ cur_pull);
            console.log('deleting old vote so the new vote could be recieved');
            let old_vote = requested_events[0].pollArray[cur_pull].voted_users[i].vote;
            let j = 0;
            let found = false;
            while (!found){
                if(requested_events[0].pollArray[cur_pull].options[j].option == old_vote){
                    found = true;
                }
                else{
                    j++;
                }
                if(j > requested_events[0].pollArray[cur_pull].options.length)
                {
                    console.log("altough user has already voted, couldnt match his vote to any other vote");
                    return ;
                }
            }
            console.log("eventId = "+requested_events[0].eventId+", user id = "+user_id+" old vote = "+ old_vote)
            console.log("going to remove the "+j+ "vote, in the "+cur_pull+" poll")
            if(cur_pull ==0){
                eventDAO.change_vote0(requested_events[0].eventId, user_id, old_vote,j,false);
            }else if(cur_pull ==1){
                eventDAO.change_vote1(requested_events[0].eventId, user_id, old_vote,j,false);
            }else{
                eventDAO.change_vote2(requested_events[0].eventId, user_id, old_vote,j,false);
            }
            return requested_events;
        }
    }
    console.log('user hasnt voted - no need to remove old votes')
    return requested_events;
}