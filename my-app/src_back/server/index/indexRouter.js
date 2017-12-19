var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'indexRouter Working!' });
});


router.get('/hello', (req, res) => {
    res.send('Hello World!')
})


router.get('/hello/:name/:lastName', (req, res) => {
    console.log(req.params)
    let name = req.params.name
    let lastName = req.params.lastName
    res.send('Hello ' + name + ' ' + lastName +'!')
})


module.exports = router;
