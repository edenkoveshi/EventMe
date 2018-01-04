const DB = require('../data/DB')
const userDAO = require('./userDAO')
const eventDAO = require('./eventDAO')
var User = require('./user')



class userService {

    checkIfUserExist(fb_id){
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(fb_id)
                .then(user_array=>{
                    console.log('checkIfUserExist - trying to get user array')
                    if(user_array.length > 0)
                    {
                        resolve(true)
                    }
                    else
                    {
                        resolve(false)
                    }
                }).catch(err => reject(err))
        })
    }
    addUser(fb_id, f_name, friends_list, location) {
        return new Promise((resolve, reject) => {
            console.log('adding user')
            var friends_id_only=[]
            console.log(friends_list)
            var counter
            for(counter = 0; counter < friends_list.length ; counter++)
            {
                friends_id_only[counter] = friends_list[counter].id
            }
            let new_user = new User(fb_id, f_name, friends_id_only, location);
            console.log('the use is:')
            console.log(new_user)
            var friends_count = friends_id_only.length
            var promises = []
            var a_promise
            var i
            for (i = 0; i < friends_count; i++)
            {
                console.log('i = '+ i)
                a_promise = update_my_friend_get_his_events(new_user, fb_id, friends_id_only[i])
                console.log('try to push a promise')
                promises.push(a_promise)
                console.log('i pushed a promise')
            }
            Promise.all(promises).then(_=>{
                userDAO.insert_user(new_user)
                    .then(_=> {
                        console.log('saved! ', new_user)
                        resolve()
                    }).catch(err => reject(err))
            })
        })
    }



    getUserByFb(fb_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(fb_id)
                .then(user=>{
                    resolve(user)
                }).catch(err=> reject(err))
        })
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            userDAO.get_all_users()
                .then(all_user=>{
                    resolve(all_user)
                }).catch(err=> reject(err))
        })
    }

    approve_participation(event_id,user_id ){
        return new Promise((resolve, reject) => {
            var promises = []
            var user_promise = eventDAO.get_event(event_id)
                .then(event=>{
                    console.log('approve_participation-. my event:',event[0])
                    if(event.length>0)
                    {
                        var am_i_invited_in_event = event[0].invited_users.indexOf(user_id)
                        if(am_i_invited_in_event > -1)
                        {
                            updated_accepted_user(event[0], user_id)
                        }
                        else
                            {
                            console.log('approve_participation - user is not invited in event')
                            console.log('approve_participation-. my event:',event[0])
                            console.log('approve_participation-. user if:',user_id)
                            console.log('approve_participation-. am i invited:',am_i_invited_in_event)
                        }

                    }
                    else
                    {
                        console.log('approve_participation - couldent find event')
                        resolve()
                    }

            }).catch(err=> reject(err))
            promises.push(user_promise)
            var event_service = userDAO.get_User_by_fb_id(user_id)
                .then(user=>{
                    if(user.length>0)
                    {
                        var am_i_invited_in_user = event[0].invited_users.indexOf(user_id)
                        if(am_i_invited_in_user > -1)
                        {
                            save_accepted_event(user[0], event_id)
                            resolve()
                        }
                        else
                        {
                            console.log('approve_participation - user is not invited in user')
                            resolve()
                        }

                    }else
                    {
                        console.log('approve_participation - couldent find user')
                        resolve()
                    }

                }).catch(err=> reject(err))
            promises.push(event_service)
            Promise.all(promises).then(_=>{
                console.log('event participation saved')
                resolve()
            }).catch(err=> reject(err))
        })
    }

    get_my_invited_events(user_id){
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user=>{
                    console.log("this is user[0]: ");
                    console.log(user);
                    let a_promise = get_all_my_full_events(user[0].invited_events);
                    a_promise.then(full_events_array=>{
                        resolve(full_events_array)
                    }).catch(err=> reject(err))
                }).catch(err=> reject(err))
        })
    }

    get_my_owned_events(user_id){
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user=>{
                    console.log("this is user[0]: ");
                    console.log(user);
                    let a_promise = get_all_my_full_events(user[0].own_public_events);
                    a_promise.then(full_events_array=>{
                        resolve(full_events_array)
                    }).catch(err=> reject(err))
                }).catch(err=> reject(err))
        })
    }

    get_my_attending_events(user_id){
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user=>{
                    console.log("this is user[0]: ");
                    console.log(user);
                    let a_promise = get_all_my_full_events(user[0].going_events);
                    a_promise.then(full_events_array=>{
                        resolve(full_events_array)
                    }).catch(err=> reject(err))
                }).catch(err=> reject(err))
        })
    }

    update_user(user){
        return new Promise((resolve, reject) => {
            console.log('trying to update user')
            console.log(user)
            userDAO.update_user(user.fb_id, user)
                .then(user=>{
                    console.log('user updated')
                    resolve()
                }).catch(err=> reject(err))
        })
    }

}

module.exports = new userService()


function update_my_friend_get_his_events(my_user, my_fb_id, friend_id)
{
    console.log('update_my_friend_get_his_events')
    return new Promise((resolve, reject) => {
        funcGetUserByFb(friend_id)
            .then(a_friend=> {
                console.log('funcGetUserByFb.then')
                console.log(my_fb_id)

                if(a_friend.length >0)
                {
                    if(a_friend[0].friends_list.indexOf(my_fb_id) < 0)
                    {
                        a_friend[0].friends_list.push(my_fb_id)
                        console.log( 'trying to update')
                        userDAO.update_friend_list(a_friend[0].fb_id, a_friend[0].friends_list).then(_=>{
                            console.log('updated', a_friend[0].fb_id)
                            resolve();
                        }).catch(err => reject(err))
                    }
                    else
                    {
                        console.log('I am already on my friend frends list, no need to update')
                        resolve();
                    }

                    var p_events = a_friend[0].own_public_events
                    if (p_events.length > 0)
                    {
                        my_user.open_friends_events.push(p_events)
                    }
                }
                resolve()
            }).catch(err => reject(err))
    })
}

function funcGetUserByFb(fb_id) {
    console.log('funcGetUserByFb')
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(fb_id)
            .then(user=>{
                if(user.length > 0) {
                    console.log('userDAO.get_User_by_fb_id(fb_id).then')
                    console.log('i wil return a :')
                    console.log(user[0].fb_id)
                }
                resolve(user)
            }).catch(err=> reject(err))
    })
}



function save_accepted_event(user, event_id){
    user.invited_events.splice(user.invited_events.indexOf(event_id),1)
    user.going_events.push(event_id)
    return new Promise((resolve, reject) => {
        userDAO.update_user(user.fb_id, user)
            .then(user=>{
                resolve()
            }).catch(err=> reject(err))
    })
}

function updated_accepted_user(event, user_id){
    event.invited_users.splice(event.invited_users.indexOf(user_id),1)
    event.going_users.push(user_id)
    return new Promise((resolve, reject) => {
        eventDAO.update_event(event.eventId, event)
            .then(user=>{
                resolve()
            }).catch(err=> reject(err))
    })
}

function get_all_my_full_events(user_invited_events){
    console.log("USER INVITED EVENTS:"+user_invited_events);
    return new Promise((resolve, reject) => {
        let full_event_list = [];
        let promises = [];
        let a_promise;
        for (let i = 0; i < user_invited_events.length ; i++){
            a_promise = eventDAO.get_event(user_invited_events[i]).then(full_event=>{
                console.log("Pushed an event, "+ full_event[0].eventId);
                full_event_list.push(full_event[0])
            }).catch(err => reject(err));
            promises.push(a_promise)
        }
        Promise.all(promises).then(_=>{
            resolve(full_event_list)
        }).catch(err=> reject(err))
    })
}