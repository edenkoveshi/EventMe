const MongoClient = require('mongodb').MongoClient
let mongoUrl = process.env.mongo_path == undefined ? 'mongodb://127.0.0.1:27017/mycloud' : process.env.mongo_path;

class DB {

    constructor(dbAddress) {
        this.dbAddress = dbAddress
        this.db = undefined
    }

    connectDB() {
        return new Promise((resolve, reject) => {
            console.log('connecting to DB at:'+mongoUrl);
            MongoClient.connect(mongoUrl) //returns a promise, or add callback - (err, database) =>  {
                .then(database => {
                    this.db = database
                    resolve()
                }).catch(err => reject(err))
        })
    }

    disconnectDB() {
        mongoClient.close();

    }
}

module.exports = new DB()

