const DB = require('../data/DB');
const eventDAO = require('./eventDAO');
const userDAO = require('./userDAO');
let Event = require('./event');


class eventService {

    addOpenEvent(owner_id, location, type, info, time, title, image) {
        return new Promise((resolve, reject) => {
            userDAO.get_User_by_fb_id(owner_id).then(own_user => {
                own_user[0].created_events += 1;
                let event_id = owner_id + own_user[0].created_events;
                let new_event = new Event(event_id, owner_id, location, type, info, time, own_user[0].friends_list, title, image);
                eventDAO.create_event(new_event)
                    .then(_ => {
                        let updated_own_open_event_list = own_user[0].own_public_events;
                        updated_own_open_event_list.push(event_id);
                        userDAO.update_user_created_events(owner_id, own_user[0].created_events);
                        userDAO.update_user_own_public_events(owner_id, updated_own_open_event_list);
                        invite_users_to_my_open_event(event_id, own_user[0].friends_list);
                        resolve()
                    }).catch(err => reject(err))
            })


        })
    }

    getEvent(event_id) {
        return new Promise((resolve, reject) => {
            eventDAO.get_event(event_id)
                .then(requested_events => {
                    resolve(requested_events[0])
                }).catch(err => reject(err))
        })
    }


}

module.exports = new eventService();


function invite_users_to_my_open_event(event_id, invited_list) {
    console.log('invite_users_to_my_open_event');
    console.log(event_id);
    console.log(invited_list);
    for (let i = 0; i < invited_list.length; i++) {
        userDAO.get_User_by_fb_id(invited_list[i]).then(invited_friend => {
            if (invited_friend.length > 0) {
                console.log('get_User_by_fb_id.then, invited_friend:', invited_friend);
                let updated_events = invited_friend[0].invited_events;
                updated_events.push(event_id);
                console.log('updated_events:', updated_events);
                console.log('friend to be updated:', invited_friend[0].fb_id);
                userDAO.update_open_friends_events(invited_friend[0].fb_id, updated_events)
            }
        })

    }
}