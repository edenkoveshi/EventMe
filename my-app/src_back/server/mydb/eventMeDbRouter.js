let express = require('express');
let router = express.Router();
const us = require('./userService');
const es = require('./eventService');
let Event = require('./event');
let User = require('./user');


/* GET home page. */
router.get('/', function (req, res) {
    res.render('frontpage');
});

router.get('/createEvent', function (req, res) {
    res.render('createevent');
});

router.get('/login',function(req,res){
    res.render('getstarted');
});

router.get('/event/:event_id', function(req, res){
    let p = es.getEvent(req.params.event_id);
    p.then((event) =>
    {   console.log(event);
        if (event !== undefined) {
            res.render('event', {
                title: event["title"], // 'my event',
                event_img: event["image"],//'restaurant.jpeg',
                event_time: event["time"],
                event_place: event["location"],
                event_type: event["type"],
                event_desc: event["information"]
            });
        }
        else{
            res.render('404');
        }
    });
});

router.get('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise((resolve, reject) => {
        es.addOpenEvent(req.params.owner_id, 'Tel Aviv', 'Eat Out', 'more info', '20:30', 'My Event', 'restaurant.jpeg')
            .then(_ => {
                res.redirect('/');
                resolve()
            }).catch(err => reject(err))
    })
});

router.get('/newUser/:fb_id/:f_name/:l_name', (req, res) => {
    return new Promise((resolve, reject) => {
        let friend_list = ["0001"];
        us.addUser(req.params.fb_id, req.params.f_name, req.params.l_name, friend_list)
            .then(_ => {
                res.redirect('/');
                resolve()
            }).catch(err => reject(err))
    })
});

router.get('/getEventById/:event_id', (req, res) => {
    return new Promise((resolve, reject) => {
        es.getEvent(req.params.event_id)
            .then(req_event => {
                console.log(req_event);
                res.render('req_event');
                resolve()
            }).catch(err => reject(err))
    })
});

router.get('/getUserByFbId/:user_fb_id', (req, res) => {
    return new Promise((resolve, reject) => {
        let usr_fb_id = req.params.user_fb_id;
        us.getUserByFb(usr_fb_id)
            .then(req_user => {
                console.log(req_user);
                //res.render('req_user');
                resolve()
            }).catch(err => reject(err))
    })
});


router.get('/showMeUsers', (req, res) => {
    return new Promise((resolve, reject) => {
        us.getAllUsers()
            .then(all_users => {
                console.log(all_users);
                //res.render(all_users);
                res.redirect('/');
                resolve()
            }).catch(err => reject(err))
    })
});

router.get('*', function(req, res){
    res.status(404).send('what???');
});


module.exports = router;