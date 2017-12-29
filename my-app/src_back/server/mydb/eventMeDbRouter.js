var express = require('express');
var router = express.Router();
const us = require('./userService');
const es = require('./eventService');
var Event = require('./event');
var User = require('./user');


/* GET home page. */
router.get('/', function (req, res) {
    res.render('getstarted');
});

/* GET home page. */
router.get('/frontpage', function (req, res) {
    res.render('frontpage');
});

router.get('/createEvent', function (req, res) {
    res.render('createevent');
});

router.get('/login', function (req, res) {
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
    p.then((event) => {
        console.log(event);
        res.redirect('/eventMe/event/'+req.params.event_id+'/'+req.params.user_id);
    });
});


// adds a new event in the DB for an existing user
router.get('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise((resolve, reject) => {
        es.addOpenEvent(req.params.owner_id, 'Tel Aviv', 'Eat Out', 'more info', '20:30', 'My Event', 'restaurant.jpeg')
            .then(_ => {
                res.redirect('/eventMe/');
                resolve()
            }).catch(err => reject(err))
    })
});

// adds a new event in the DB for an existing user
router.post('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise((resolve, reject) => {
        es.addOpenEvent(req.params.owner_id, 'Tel Aviv', 'Eat Out', 'more info', '20:30', 'My Event', 'restaurant.jpeg')
            .then(_ => {
                res.redirect('/eventMe/');
                resolve()
            }).catch(err => reject(err))
    })
});
/*
// create a new user in the DB
router.get('/newUser/:fb_id/:f_name/:l_name', (req, res) => {
    return new Promise( (resolve, reject) => {
        var friend_list = ["0001"]
        us.addUser(req.params.fb_id, req.params.f_name, req.params.l_name, friend_list)
            .then(_=> {
                resolve()
            }).catch(err => reject(err))
    })
});
*/

router.post('/newUser/:fb_id/:f_name/:l_name', (req, res) => {
    return new Promise( (resolve, reject) => {
        var fb_id = req.body.fb_id
        var f_name = req.body.f_name
        var l_name = req.body.l_name
        var friend_list = req.body.friend_list

        us.addUser(fb_id, f_name, l_name, friend_list)
            .then(_=> {
                resolve()
            }).catch(err => reject(err))
    })
});


router.get('/getUserByFbId/:user_fb_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        let usr_fb_id = req.params.user_fb_id
        us.getUserByFb(usr_fb_id)
            .then(req_user => {
                console.log(req_user)
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
        us.get_my_invited_events( req.params.user_id )
            .then(events_array=> {
                console.log(events_array)
                resolve()
            }).catch(err => reject(err))
    })
})

module.exports = router;


// router.post('/newEvent/:owner_name', (req, res) => {
//     return new Promise( (resolve, reject) => {
//         us.addUser(req.params.owner_name, req.params.l_name)
//             .then(_=> {
//                 res.redirect('/')
//                 resolve()
//             }).catch(err => reject(err))
//     })
// })
//
