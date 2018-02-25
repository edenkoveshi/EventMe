//const DB = require('../data/DB');
const userDAO = require('./userDAO');
const eventDAO = require('./eventDAO');
const es = require('./eventService');
let User = require('./user');


class userService {

    addUser(fb_id, f_name, friends_list, location) {
        return new Promise((resolve, reject) => {
            console.log('adding user');
            let friends_id_only = [];
            console.log(friends_list);
            let counter;
            for (counter = 0; counter < friends_list.length; counter++) {
                friends_id_only[counter] = friends_list[counter].id
            }
            let new_user = new User(fb_id, f_name, friends_id_only, location);
            console.log('the user is:');
            console.log(new_user);
            let friends_count = friends_id_only.length;
            let promises = [];
            let my_friends_events_list = [];
            let a_promise;
            let i;
            for (i = 0; i < friends_count; i++) {
                console.log('Update my ' + i + " friend");
                a_promise = update_my_friend_get_his_events(my_friends_events_list, i, fb_id, friends_id_only[i]);
                promises.push(a_promise)
            }
            Promise.all(promises).then(_=> {
                for (let f_ounter = 0; f_ounter < friends_count; f_ounter++) {
                    for (let event_ounter = 0; event_ounter < my_friends_events_list[f_ounter].length; event_ounter++) {
                        new_user.invited_events.push(my_friends_events_list[f_ounter][event_ounter]);
                        add_me_to_event_as_invited(new_user.fb_id, new_user.f_name, my_friends_events_list[f_ounter][event_ounter])
                    }
                }
                userDAO.insert_user(new_user)
                    .then(_ => {
                        console.log('saved! ', new_user);
                        resolve()
                    }).catch(err => reject(err))
            })
        })
    }


    getUserByFb(fb_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(fb_id)
                .then(user => {
                    resolve(user)
                }).catch(err => reject(err))
        })
    }

    checkUserID(fb_id, req) {
        //console.log(this.hashID(fb_id));
        return (this.hashID(fb_id) == req.cookies['user_id']);
    }

    hashID(str) {
        return str.split('').reduce((prevHash, currVal) =>
            ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            userDAO.get_all_users()
                .then(all_user => {
                    resolve(all_user)
                }).catch(err => reject(err))
        })
    }

    approve_participation(event_id, user_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user => {
                    if (user.length > 0) {
                        let am_i_invited_in_user = user[0].invited_events.indexOf(event_id);
                        if (am_i_invited_in_user > -1) {
                            eventDAO.get_event(event_id)
                                .then(event => {
                                    console.log('approve_participation-. my event:', event[0].eventId);
                                    console.log('approve_participation - event.length:', event.length);
                                    if (event.length > 0) {
                                        console.log('approve_participation - event length is good');
                                        let am_i_invited_in_event = event[0].invited_users.indexOf(user_id);
                                        console.log('approve_participation - my index in the invited list is:', am_i_invited_in_event);
                                        if (am_i_invited_in_event > -1) {
                                            updated_accepted_user(event[0], user_id, user[0].f_name);
                                            save_accepted_event(user[0], event_id);
                                        }
                                        else {
                                            console.log('approve_participation - user is not invited in event');
                                            console.log('approve_participation-. my event:', event[0]);
                                            console.log('approve_participation-. user if:', user_id);
                                            console.log('approve_participation-. am i invited:', am_i_invited_in_event)
                                        }

                                    }
                                    else {
                                        console.log('approve_participation - couldent find event')
                                    }
                                }).catch(err => reject(err))
                        }
                        else {
                            console.log('approve_participation - user is not invited in user')
                        }

                    } else {
                        console.log('approve_participation - couldent find user')
                    }
                    console.log('event participation saved');
                    resolve()

                }).catch(err => reject(err))
        })
    }


    leave_event(event_id, user_id) {
        return new Promise((resolve, reject) => {
            console.log('--------leave_event------');
            userDAO.get_User_by_fb_id(user_id)
                .then(user => {
                    if (user.length > 0) {
                        let do_i_participate_in_user = user[0].going_events.indexOf(event_id);
                        if (do_i_participate_in_user > -1) {
                            eventDAO.get_event(event_id)
                                .then(event => {
                                    console.log('leave_event-. my event:', event[0]);
                                    if (event.length > 0) {
                                        let do_i_participate = event[0].going_users.indexOf(user_id);
                                        if (do_i_participate > -1) {
                                            updated_left_user(event[0], user_id, user[0].f_name)
                                            save_left_event(user[0], event_id);
                                        }
                                        else {
                                            console.log('leave_event - the user does not participate in this event');
                                            console.log('leave_event-. my event:', event[0]);
                                            console.log('leave_event-. user if:', user_id);
                                            console.log('leave_event-. do i participate?:', do_i_participate)
                                        }

                                    }
                                    else {
                                        console.log('leave_event - couldent find event')
                                    }

                                }).catch(err => reject(err))
                        }
                        else {
                            console.log('leave_event - user does not participate in user')
                        }

                    } else {
                        console.log('leave_event - couldent find user')
                    }
                    console.log('left the event');
                    resolve()
                }).catch(err => reject(err))
        })
    }

    get_my_invited_events(user_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user => {
                    let a_promise = get_all_my_full_events(user[0], 'invited_events');
                    a_promise.then(full_events_array => {
                        resolve(full_events_array)
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
        })
    }

    get_my_owned_events(user_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user => {
                    console.log("this is user[0]: ");
                    console.log(user);
                    let a_promise = get_all_my_full_events(user[0], 'own_public_events');
                    a_promise.then(full_events_array => {
                        resolve(full_events_array)
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
        })
    }

    get_my_attending_events(user_id) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(user_id)
                .then(user => {
                    console.log("this is user[0]: ");
                    console.log(user);
                    let a_promise = get_all_my_full_events(user[0], 'going_events');
                    a_promise.then(full_events_array => {
                        resolve(full_events_array)
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
        })
    }

    update_user(user) {
        return new Promise((resolve, reject) => {
            console.log('trying to update user');
            console.log(user);
            userDAO.update_user(user.fb_id, user)
                .then(updated_user => {
                    console.log('user updated ');
                    resolve()
                }).catch(err => reject(err))
        })
    }

}

module.exports = new userService();


function update_my_friend_get_his_events(my_friends_events_list, friend_index, my_fb_id, friend_id) {
    console.log('update_my_friend_get_his_events');
    return new Promise((resolve, reject) => {
        funcGetUserByFb(friend_id)
            .then(a_friend => {
                console.log('funcGetUserByFb.then');
                console.log(my_fb_id);
                my_friends_events_list[friend_index] = [];
                if (a_friend.length > 0) {
                    if (a_friend[0].friends_list.indexOf(my_fb_id) < 0) {
                        a_friend[0].friends_list.push(my_fb_id);
                        console.log('trying to update');
                        userDAO.update_friend_list(a_friend[0].fb_id, a_friend[0].friends_list).then(_=> {
                            console.log('updated', a_friend[0].fb_id);
                            resolve();
                        }).catch(err => reject(err))
                    }
                    else {
                        console.log('I am already on my friend frends list, no need to update');
                        resolve();
                    }

                    let p_events = a_friend[0].own_public_events;
                    for (let i = 0; i < p_events.length; i++) {
                        my_friends_events_list[friend_index].push(p_events[i])
                    }
                }
                resolve()
            }).catch(err => reject(err))
    })
}

function add_me_to_event_as_invited(my_id, my_name, event_id) {
    console.log('-------add_me_to_event_as_invited----------');
    eventDAO.get_event(event_id).then(req_event => {
        req_event[0].invited_users.push(my_id);
        req_event[0].invitedName.push(my_name);
        eventDAO.update_event(event_id, req_event[0])
    }).catch(err => reject(err))

}

function funcGetUserByFb(fb_id) {
    console.log('funcGetUserByFb');
    return new Promise((resolve, reject) => {
        userDAO.get_User_by_fb_id(fb_id)
            .then(user => {
                if (user.length > 0) {
                    console.log('userDAO.get_User_by_fb_id(fb_id).then');
                    console.log('i wil return a :');
                    console.log(user[0].fb_id)
                }
                resolve(user)
            }).catch(err => reject(err))
    })
}

function save_left_event(user, event_id) {
    user.going_events.splice(user.invited_events.indexOf(event_id), 1);
    user.invited_events.push(event_id);
    return new Promise((resolve, reject) => {
        userDAO.update_user(user.fb_id, user)
            .then(user => {
                resolve()
            }).catch(err => reject(err))
    })
}

function save_accepted_event(user, event_id) {
    user.invited_events.splice(user.invited_events.indexOf(event_id), 1);
    user.going_events.push(event_id);
    return new Promise((resolve, reject) => {
        userDAO.update_user(user.fb_id, user)
            .then(user => {
                resolve()
            }).catch(err => reject(err))
    })
}

function updated_left_user(event, user_id, user_name) {
    event_id = event.eventId;
    eventDAO.leave_event(event_id, user_id, user_name);
    console.log('updated_left_user - going to save the event:');
    //console.log(event)
    let updated_event = es.remove_all_my_votes(event, user_id);
}

function updated_accepted_user(event, user_id, user_name) {
    eventDAO.join_event(event.eventId, user_id, user_name)
}
function move_event_to_old(user, invited_list, event_id)
{
    console.log("-----move_event_to_old--------");
    console.log("old events:")
    console.log(user["old_events"])
    user[invited_list].splice(user[invited_list].indexOf(event_id), 1);
    user["old_events"].push(event_id);
    userDAO.update_user(user.fb_id, user)
}
function get_all_my_full_events(user, invited_list) {
    let user_invited_events = user[invited_list];
    console.log("USER INVITED EVENTS:" + user_invited_events);
    return new Promise((resolve, reject) => {
        let full_event_list = [];
        let promises = [];
        let a_promise;
        for (let i = 0; i < user_invited_events.length; i++) {
            a_promise = eventDAO.get_event(user_invited_events[i]).then(full_event => {
                console.log('trying to validate event time for event Id '+full_event[0].eventId);
                if(validate_event_date(full_event[0]))
                {
                    console.log("Pushed an event, " + full_event[0].eventId);
                    full_event_list.push(full_event[0])
                }else
                {
                    move_event_to_old(user, invited_list, full_event[0].eventId)
                }

            }).catch(err => reject(err));
            promises.push(a_promise)
        }
        Promise.all(promises).then(_ => {
            resolve(full_event_list)
        }).catch(err => reject(err))
    }).catch(err => reject(err))
}

function validate_event_date(event){
    console.log("-------validate_event_date--------");
    return ValidateTime(event.time);
}
function parseISOString(s) {
    console.log("-------parseISOString--------");
    let b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], 0, 0));
}
function ValidateTime(time) {
    console.log("-------ValidateTime--------" + time );
    if ((time == undefined)|| (time == ""))
    {
        return true;
    }
    let chosen = parseISOString(time);
    let current = new Date();
    if (chosen.getTime() - current.getTime() < 3540000)
    {
        return false;
    }
    else
    {
        console.log('the event willl expire in: '+ (chosen.getTime() - current.getTime())/3540000 );

        return true;
    }
}