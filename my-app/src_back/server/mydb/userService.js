const DB = require('../data/DB')
const userDAO = require('./userDAO')
const eventDAO = require('./eventDAO')
var User = require('./user')



class userService {

    addUserthin(fb_id, first_name, last_name, friends_list) {
        return new Promise((resolve, reject) => {
            let new_user = new User(fb_id, first_name, last_name, friends_list)
            userDAO.insert_user(new_user)
                .then(_=> {
                    console.log('saved! ', new_user)
                    resolve()
                }).catch(err => reject(err))
        })
    }

    addUser(fb_id, first_name, last_name, friends_list) {
        return new Promise((resolve, reject) => {
            console.log('addUser')
            let new_user = new User(fb_id, first_name, last_name, friends_list);
            var friends_count = friends_list.length
            var promises = []
            var a_promise
            for (var i = 0; i < friends_count; i++)
            {
                console.log('i = '+ i)
                a_promise = update_my_friend_get_his_events(new_user, fb_id, friends_list[i]).then(_=>
                {
                    resolve();
                }).catch(err => reject(err))
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
                    updated_accepted_user(event[0], user_id)
                    resolve()
            }).catch(err=> reject(err))
            promises.push(user_promise)
            var event_service = userDAO.get_User_by_fb_id(user_id)
                .then(user=>{
                    save_accepted_event(user[0], event_id)
                    resolve()
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
                    var a_promise = get_all_my_full_events(user[0].invited_events)
                    a_promise.then(full_events_array=>{
                        resolve(full_events_array)
                    }).catch(err=> reject(err))
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
                    a_friend[0].friends_list.push(my_fb_id)
                    console.log( 'trying to update')
                    userDAO.update_friend_list(a_friend[0].fb_id, a_friend[0].friends_list).then(_=>{
                        console.log('updated', a_friend)
                        resolve();
                    }).catch(err => reject(err))
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
                console.log('userDAO.get_User_by_fb_id(fb_id).then')
                console.log('i wil return a :')
                console.log(user)
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
    return new Promise((resolve, reject) => {
        var full_event_list = []
        var promises = []
        var a_promise
        for (var i = 0; i < user_invited_events.length ; i++){
            a_promise = eventDAO.get_event(user_invited_events[i]).then(full_event=>{
                full_event_list.push(full_event)
            }).catch(err => reject(err))
            promises.push(a_promise)
        }
        Promise.all(promises).then(_=>{
            resolve(full_event_list)
        }).catch(err=> reject(err))
    })
}