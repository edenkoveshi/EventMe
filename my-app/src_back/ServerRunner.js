/**
 */
const WebServer = require('./bin/WebServer')
const DB = require('./server/data/DB')

let httpsPort = 443;
DB.connectDB()
    .then(_ => {
        WebServer.listenOnPort(httpsPort)
        console.log('listening on port ' + httpsPort)
    }).catch(err => console.log(err))



