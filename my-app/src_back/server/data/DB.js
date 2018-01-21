const MongoClient = require('mongodb').MongoClient

class DB{

    constructor(dbAddress){
        this.dbAddress = dbAddress
        this.db = undefined
    }
    connectDB(){
        return new Promise((resolve, reject) =>{
            MongoClient.connect('mongodb://127.0.0.1:27017/mycloud') //returns a promise, or add callback - (err, database) =>  {
                .then(database => {
                    this.db = database
                    resolve()
                }).catch(err=> reject(err))
        })
    }
    disconnectDB(){
        mongoClient.close();

    }
}

module.exports = new DB()

