let express = require('express');
let router = express.Router();
const es = require('../mydb/eventService');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'eventMe index Working!' });
});

router.get('/event/:event_id', function(req, res){
    let p = es.getEvent(req.params.event_id);
    p.then((event) =>
    {   console.log(event);
        if (event != undefined) {
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

module.exports = router;
