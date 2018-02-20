/**
 */
const WebServer = require('./bin/WebServer')
const DB = require('./server/data/DB')


DB.connectDB()
    .then(_=> {
        WebServer.listenOnPort('443')
        console.log('listening on port 443')
    }).catch(err => console.log(err))



