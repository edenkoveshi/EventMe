const MongoClient = require('mongodb').MongoClient

class DB{

    constructor(dbAddress){
        this.dbAddress = dbAddress
        this.db = undefined
    }
    connectDB(){
        return new Promise((resolve, reject) =>{

            var uri = "mongodb://eventme:Google123@cluster0-shard-00-00-fk6yv.mongodb.net:27017,cluster0-shard-00-01-fk6yv.mongodb.net:27017,cluster0-shard-00-02-fk6yv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

            //MongoClient.connect('mongodb://127.0.0.1:27017/mycloud') //returns a promise, or add callback - (err, database) =>  {

            MongoClient.connect(uri).then(database => {
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

