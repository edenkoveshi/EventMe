var express = require('express');
var router = express.Router();
const us = require('./userService')
const es = require('./eventService')
var Event = require('./event')
var User = require('./user')


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'eventMe DB routers home!' });
});

router.get('/addOpenEvent/:owner_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        es.addOpenEvent(req.params.owner_id,'1','2','3','4')
            .then(_=> {
                res.redirect('/')
                resolve()
            }).catch(err => reject(err))
    })
})

router.get('/newUser/:fb_id/:f_name/:l_name', (req, res) => {
    return new Promise( (resolve, reject) => {
        var friend_list = ["0001"]
        us.addUser(req.params.fb_id, req.params.f_name, req.params.l_name, friend_list)
            .then(_=> {
                res.redirect('/')
                resolve()
            }).catch(err => reject(err))
    })
})

router.get('/getEventById/:event_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        es.getEvent(req.params.event_id)
            .then(req_event => {
                console.log(req_event)
                res.render('req_event');
                resolve()
            }).catch(err => reject(err))
    })
})

router.get('/getUserByFbId/:user_fb_id', (req, res) => {
    return new Promise( (resolve, reject) => {
        let usr_fb_id = req.params.user_fb_id
        us.getUserByFb(usr_fb_id)
            .then(req_user => {
                console.log(req_user)
                //res.render('req_user');
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
                res.redirect('/')
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
