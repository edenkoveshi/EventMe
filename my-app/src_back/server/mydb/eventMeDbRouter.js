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


router.get('/frontpage/:user_id', function (req, res) {

    res.render('frontpage',{
        user_id: req.params.user_id
    });
});

router.get('/myevents', function (req, res) {
    res.render('myevents');
});

router.get('/createEvent', function (req, res) {
    res.render('createevent');
});

router.get('/getstarted', function (req, res) {
    res.render('getstarted');
});



/* render single event page, of the event with the given event_id */
router.get('/event/:event_id/:user_id', function(req, res){
    let p = es.getEvent(req.params.event_id);
    p.then((event) =>
    {
        console.log(event);
        if (event !== undefined) {
            res.render('event', {
                event_id: req.params.event_id,
                title: event["title"], // 'my event',
                event_img: event["image"],//'restaurant.jpeg',
                event_time: event["time"],
                event_place: event["location"],
                event_type: event["type"],
                event_desc: event["information"],
                user_id: req.params.user_id,

            });
        }
        else{
            res.render('404');
        }
    });
});

router.get('/joinEvent/:event_id/:user_id', function(req, res) {
    let p =us.approve_participation(req.params.event_id, req.params.user_id );
    p.then(_ => {
        res.redirect('/eventMe/event/'+req.params.event_id+'/'+req.params.user_id);
    });
});


// adds a new event in the DB for an existing user
/*
router.get('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise((resolve, reject) => {
        es.addOpenEvent(req.params.owner_id, 'Tel Aviv', 'Eat Out', 'more info', '20:30', 'My Event', 'restaurant.jpeg')
            .then(_ => {
                res.redirect('/eventMe/');
                resolve()
            }).catch(err => reject(err))
    })
});
*/

// adds a new event in the DB for an existing user
router.get('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise((resolve, reject) => {
        console.log(' is trying to create new event')
        es.addOpenEvent(req.params.owner_id, req.params.owner_id, 'Tel Aviv', 'Eat Out', 'more info', '20:30', 'My Event', 'restaurant.jpeg')
            .then(_ => {
                res.redirect('/eventMe/');
                resolve()
            }).catch(err => reject(err))
    })
});

router.post('/newUser', (req, res) => {
    console.log('trying to add new user')
    return new Promise( (resolve, reject) => {
        console.log(req.body)
        var fb_id = req.body.fb_id
        var f_name = req.body.f_name
        var location = req.body.location
        var friend_list = req.body.friend_list
        console.log(fb_id, f_name, friend_list)
        var frontpage = '/eventMe/frontpage/'+ fb_id
        us.getUserByFb(fb_id)
            .then(user=>{
                if(user.length > 0 )
                {
                    us.get_my_invited_events( fb_id )
                        .then(events_array=> {
                            res.redirect(frontpage);
                            res.render('frontpage',{
                                                    invited_events : events_array,
                                                    user_id : fb_id,
                                                    location : location})
                            resolve()
                        }).catch(err => reject(err))

                }else
                {
                    us.addUser(fb_id, f_name, friend_list)
                        .then(_=>{
                            us.get_my_invited_events( fb_id )
                                .then(events_array=> {
                                    res.redirect(frontpage);
                                    res.render('frontpage',{
                                                            invited_events : events_array,
                                                            user_id : fb_id,
                                                            location : location})
                                    resolve()
                                }).catch(err => reject(err))
                        }).catch(err => reject(err))
                }
            })
    })
});
router.get('/newUserTest/:fb_id', (req, res) => {
    console.log('newUserTest - trying to add new user')
    return new Promise( (resolve, reject) => {
        var fb_id = req.params.fb_id
        var f_name = 'somename'
        var location = '111, 111'
        var friend_list = ['0002']
        console.log(fb_id, f_name, friend_list)
        var frontpage = '/eventMe/frontpage/'+ fb_id
        us.getUserByFb(fb_id)
            .then(user=>{
                if(user.length > 0 )
                {
                    console.log(' user is already in the db')
                    us.get_my_invited_events( req.params.fb_id )
                        .then(events_array=> {
                            console.log('redirecting to frontpage')
                            res.redirect(frontpage);
                            res.render('frontpage',{
                                                    invited_events : events_array,
                                                    user_id : fb_id,
                                                    location : location})
                            resolve()
                        }).catch(err => reject(err))

                }else
                {
                    console.log(' user is not  in the db,  i will add him')
                    us.addUser(fb_id, f_name, friend_list)
                        .then(_=>{
                            us.get_my_invited_events( req.params.fb_id )
                                .then(events_array=> {
                                    console.log('redirecting to frontpage')
                                    res.redirect(frontpage);
                                    res.render('frontpage',{
                                                            invited_events : events_array,
                                                            user_id : fb_id,
                                                            location : location})
                                    resolve()
                                }).catch(err => reject(err))
                        }).catch(err => reject(err))
                }
            })
    })
});


router.get('/getUserByFbId/:user_fb_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        console.log('requesting user')
        let usr_fb_id = req.params.user_fb_id
        us.getUserByFb(usr_fb_id)
            .then(req_user => {
                console.log('user requested recieved = ', req_user.fb_id)
                res.render('req_user');
                resolve()
            }).catch(err => reject(err))
    })
})


router.get('/showMeUsers', (req, res) => {
    return new Promise( (resolve, reject) => {
        us.getAllUsers()
            .then(all_users => {
                console.log(all_users)
                //res.render(all_users);
                resolve()
            }).catch(err => reject(err))
    })
})

// 404 routing
router.get('*', function(req, res){
    res.status(404).send('404 : The page you have requested does not exist.');
});


router.get('/getMyInvitedEvents/:user_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        console.log('getting all of my invited arrays:')
        us.get_my_invited_events( req.params.user_id )
            .then(events_array=> {
                console.log('recieved ',events_array.length,' arreys')
                resolve()
            }).catch(err => reject(err))
    })
})

module.exports = router;


// router.post('/newEvent/:owner_name', (req, res) => {
//     return new Promise( (resolve, reject) => {
//         us.addUser(req.params.owner_name)
//             .then(_=> {
//                 res.redirect('/')
//                 resolve()
//             }).catch(err => reject(err))
//     })
// })
//
