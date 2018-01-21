var express = require('express');
var router = express.Router();
const us = require('./userService');
const es = require('./eventService');
var Event = require('./event');
var User = require('./user');


/* GET home page. */
router.get('/', function (req, res) {
    res.render('welcome');
});

router.get('/welcome', function (req, res) {
    res.render('welcome');
});


router.get('/createEvent/:user_id', function (req, res) {
    res.render('createevent', {user_id: req.params.user_id});
});
/*
************************************
            getstarted page
    params : none
    body : none
    redirect : ----
    render page:  getstarted
    render contant : none

    public page
    for login to the site
*************************************
 */

router.get('/getstarted', function (req, res) {
    res.render('getstarted');
});

/*
************************************
            event page
    params :
            event_id
            user_id
    body : none
    redirect : event
    render page:  event
    render contant :
                event_id
                title
                event_img
                event_time
                event_place
                event_type
                event_desc
                user_id
                going_users
                invited_users
                invited_ids
                going_ids
                pollArray
                pollCounter

    public page
    changes user status in an event from, invited to attending
*************************************
 */
router.get('/event/:event_id/:user_id', function (req, res) {
    let p = es.getEvent(req.params.event_id);
    p.then((event) => {
        console.log(event);
        if (event !== undefined) {
            res.render('event', {
                event_id: req.params.event_id,
                title: event["title"], // 'my event',
                event_img: (event["image"] == "" ? event["image"] : 'restaurant.jpeg'),
                event_time: (event["time"] == undefined ? "" : event["time"]),
                event_place: (event["location"] == undefined ? "" : event["location"]),
                event_type: event["type"],
                event_desc: event["information"],
                user_id: req.params.user_id,
                going_users: (event["goingName"] == undefined ? [] : event["goingName"]),
                invited_users:
                    event["invitedName"] == undefined ? [] : event["invitedName"],
                invited_ids : (event["invited_users"] == undefined ? [] : event["invited_users"]),
                going_ids: (event["going_users"]==undefined ? [] : event["going_users"]),
                pollArray: (event["pollArray"] == undefined ? [] : JSON.stringify(event["pollArray"])),
                pollCounter: event["pollCounter"],
                owner_id: event["ownerId"],
                //pollQuestion: event["pollQuestion"],
            })
            ;
        }
        else {
            res.render('404');
        }
    });
});

router.get('/joinEvent/:event_id/:user_id', function (req, res) {
    let p = us.approve_participation(req.params.event_id, req.params.user_id);
    p.then(_ => {
        res.redirect('/eventMe/event/' + req.params.event_id + '/' + req.params.user_id);
    });
});

/*
************************************
            unattend page
    params :
            event_id
            user_id
    body : none
    redirect : event
    render page:  ---
    render contant : ----


    public page
    changes user status in an event from, invited to attending
*************************************
 */

router.get('/unattend/:event_id/:user_id', function (req, res) {
    console.log('-------unattend--------')
    console.log('event_id:',req.params.event_id)
    console.log('user_id:',req.params.user_id)
    let p = us.leave_event(req.params.event_id, req.params.user_id);
    p.then(_ => {
        res.redirect('/eventMe/event/' + req.params.event_id + '/' + req.params.user_id);
    });
});

/*
************************************
            delete_event page
    params :
            event_id
            user_id
    body : none
    redirect : sender
    render page:  ---
    render contant : ----


    public page
    deletes an event
*************************************
 */

router.get('/delete_event/:event_id/:user_id', function (req, res) {
    console.log('-------delete_event--------')
    console.log('event_id:',req.params.event_id)
    console.log('user_id:',req.params.user_id)
    es.delete_my_event(req.params.event_id, req.params.user_id)
        .then(_ => {
        console.log('delelted event - event deleted')
        res.redirect(req.get('referer'));
    });
});

/*
************************************
            addOpenEvent page
    params : user_id
    body :
            user_id
            Activity_name
            google-location
            categories
            description
            Activity_time

            poll_counter   --- tells how many relevant polls exist
            poll1          --- an array containing the polls possibilities
            poll1_length   --- tels how many possibilities in the poll
            poll1_question --- string containing the polls headline/question

            poll2..
            poll3..


    redirect : frontpage
    render page:  ---
    render contant : ----


    public page
    creates a new event for a specific user - updated all the orgenizer friends about the event
*************************************
 */
router.post('/addOpenEvent/:user_id', (req, res) => {
    return new Promise((resolve, reject) => {
        console.log(' is trying to create new event');
        console.log(req.body);
        es.addOpenEvent(req.params["user_id"], req.body["Activity_name"], req.body["google-location"], req.body["categories"], req.body["description"], req.body["Activity_time"],req.body)
            .then(_ => {
                let newUrl = '/eventMe/myOwnEvents/' + req.params["user_id"];
                console.log(newUrl);
                res.redirect(newUrl);
                resolve()
            }).catch(err => reject(err))
    })
});

/*
************************************
            newUserTest page
    params :
            fb_id
            f_name
    body : none
    redirect : frontpage
    render page:  ---
    render contant : ----


    private page
    a page for testing - insert fake users that are friends to the website developers
*************************************
 */
router.get('/newUserTest/:fb_id/:f_name', (req, res) => {
    return new Promise((resolve, reject) => {
        let friend_list = [{name: 'barak', id: '10155189617577308'}, {
            name: 'itay',
            id: '10209916833948634'
        }, {name: 'Ronnie Artzi', id: '10155941032798926'},
            {name: 'Eden Koveshi', id: '2358949860799526'}]
        let frontpage = '/eventMe/frontpage/' + req.params.fb_id
        us.addUser(req.params.fb_id, req.params.f_name, friend_list)
            .then(events_array => {
                res.redirect(frontpage);
                resolve()
            }).catch(err => reject(err))
    })
})

/*
************************************
            newUser page
    params : none
    body :
            fb_id
            f_name
            location
            friend_list
    redirect : frontpage
    render page:  ---
    render contant : ----


    public page
    render the events I am invted to
*************************************
 */


router.post('/newUser', (req, res) => {
    console.log('trying to add new user');
    return new Promise((resolve, reject) => {
        // console.log(req.body);
        var fb_id = req.body.fb_id;
        var f_name = req.body.f_name;
        var location = req.body.location;
        var friend_list = JSON.parse(req.body.friend_list);
        console.log(fb_id, f_name, friend_list);
        var frontpage = '/eventMe/frontpage/' + fb_id;
        us.getUserByFb(fb_id)
            .then(user => {
                if (user.length > 0) {
                    console.log('user is already in the db, updating location and redirecting to frontpage');
                    user[0].current_location = location
                    var friends_id_only=[]
                    console.log(friend_list)
                    var counter
                    for(counter = 0; counter < friend_list.length ; counter++)
                    {
                        friends_id_only[counter] = friend_list[counter].id
                    }
                    user[0].friends_list = friends_id_only;
                    us.update_user(user[0])
                        .then(_ => {
                            res.redirect(frontpage);
                            resolve()
                        }).catch(err => reject(err))

                } else {
                    console.log('the user is not in the DB -> trying to add him');
                    us.addUser(fb_id, f_name, friend_list, location)
                        .then(_ => {
                            us.get_my_invited_events(fb_id)
                                .then(events_array => {
                                    res.redirect(frontpage);
                                    resolve()
                                }).catch(err => reject(err))
                        }).catch(err => reject(err))
                }
            })
    })
});

/*
************************************
            frontpage page
    params : fb_id
    body : none
    redirect : none
    render page: frontpage
    render contant :
                     invited_events
                     user_id
                     location

    public page
    render the events I am invted to
*************************************
 */

router.get('/frontpage/:fb_id', (req, res) => {
    console.log('------frontpage---------')
    let fb_id = req.params.fb_id;
    us.getUserByFb(fb_id)
        .then(user => {
            if (user.length > 0) {
                console.log(' good job - user is in the DB');
                us.get_my_invited_events(req.params.fb_id)
                    .then(events_array => {
                        console.log('these are the user full events array:');
                        console.log(events_array);
                        res.render('frontpage', {
                            invited_events: events_array,
                            user_id: fb_id,
                            location: user[0].current_location
                        })
                    }).catch(err => reject(err))

            }
            else {
                console.log(' user is not  in the db!!!!!!!!!!!!!!!!!!!!!');
            }
        }).catch(err=> reject(err))
});

/*
************************************
            myOwnEvents page
    params : fb_id
    body : none
    redirect : none
    render page: myOwnEvents
    render contant :
                     invited_events
                     user_id
                     location

    public page
    render the events I created
*************************************
 */

router.get('/myOwnEvents/:fb_id', (req, res) => {
    console.log('------myOwnEvents page---------')
    let fb_id = req.params.fb_id;
    us.getUserByFb(fb_id)
        .then(user => {
            if (user.length > 0) {
                console.log(' good job - user is in the DB');
                us.get_my_owned_events(req.params.fb_id)
                    .then(events_array => {
                        console.log('these are the user full events array:');
                        console.log(events_array);
                        res.render('myownevents', {
                            invited_events: events_array,
                            user_id: fb_id,
                            location: user[0].current_location
                        })
                    }).catch(err => reject(err))

            }
            else {
                console.log(' user is not  in the db!!!!!!!!!!!!!!!!!!!!!');
            }
        })
});

/*
************************************
            eventsiattend page
    params : fb_id
    body : none
    redirect : none
    render page: eventsiattend
    render contant :
                     invited_events
                     user_id
                     location

    public page
    render the events I attend
*************************************
 */

router.get('/eventsiattend/:fb_id', (req, res) => {
    console.log('------eventsiattend page---------')
    let fb_id = req.params.fb_id;
    us.getUserByFb(fb_id)
        .then(user => {
            if (user.length > 0) {
                console.log(' good job - user is in the DB');
                us.get_my_attending_events(req.params.fb_id)
                    .then(events_array => {
                        console.log('these are the user full events array:');
                        console.log(events_array);
                        res.render('eventsiattend', {
                            invited_events: events_array,
                            user_id: fb_id,
                            location: user[0].current_location
                        })
                    }).catch(err => reject(err))

            }
            else
            {
                console.log(' user is not  in the db!!!!!!!!!!!!!!!!!!!!!');
            }
        })
});

/*
************************************
            shoeMeUsers page
    params : none
    body : none
    redirect : none

    private page
    prints to console my all of the users
*************************************
 */

router.get('/showMeUsers', (req, res) => {
    return new Promise((resolve, reject) => {
        us.getAllUsers()
            .then(all_users => {
                console.log(all_users);
                //res.render(all_users);
                resolve()
            }).catch(err => reject(err))
    })
});

// 404 routing
router.get('*', function (req, res) {
    res.status(404).send('404 : The page you have requested does not exist.');
});

/*
************************************
            getMyInvitedEvents page
    params : user_id
    body : none
    redirect : none

    private page
    prints to console my invted events
*************************************
 */

router.get('/getMyInvitedEvents/:user_id', (req, res) => {
    return new Promise((resolve, reject) => {
        console.log('getting all of my invited arrays:');
        us.get_my_invited_events(req.params.user_id)
            .then(events_array => {
                console.log('recieved ', events_array.length, ' arreys');
                resolve()
            }).catch(err => reject(err))
    })
});

/*
************************************
            vote page
    params : user_id
    body : user_id, eventId, myVote
    redirect : /eventMe/event

    the page update use's vote
*************************************
 */

router.post('/vote/:user_id', (req, res) => {
   return new Promise((resolve, reject) => {
       console.log('I am using my right to vote !  go trump!')
       user_id = req.params.user_id
       event_id = req.body.eventId
       cur_pull = req.body.pollNum
       my_vote = req.body.myVote
       console.log(req.body);
       es.vote(user_id ,event_id ,cur_pull - 1, my_vote).then(_=>{
           console.log('I managed to vote!!, maybe i shoudent have voted for trump...')
           res.redirect('/eventMe/event/' + event_id + '/' + user_id);
           resolve()
       }).catch(err => reject(err))
   })
});

module.exports = router;


// router.get('/getUserByFbId/:user_fb_id', (req, res) => {
//     return new Promise((resolve, reject) => {
//         console.log('requesting user');
//         let usr_fb_id = req.params.user_fb_id;
//         us.getUserByFb(usr_fb_id)
//             .then(req_user => {
//                 console.log('user requested recieved = ', req_user[0].fb_id);
//                 res.render('req_user');
//                 resolve()
//             }).catch(err => reject(err))
//     })
// });



// //GET home page.
// router.get('/', function (req, res) {
//     res.render('getstarted');
// });
//
// router.get('/welcome', function (req, res) {
//     res.render('welcome');
// });
//
//
// router.get('/createEvent/:user_id', function (req, res) {
//     res.render('createevent', {user_id: req.params.user_id});
// });
