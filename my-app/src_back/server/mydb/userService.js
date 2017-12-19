const DB = require('../data/DB')
const userDAO = require('./userDAO')
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
            var friends_updated_counter = 0
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