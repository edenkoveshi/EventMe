const DB = require('../data/DB');

class eventDAO
{

    create_event(event)
    {
      return DB.db.collection('events').insertOne(event) //returns a Promise
    }

    get_event(eventId)
    {
        return DB.db.collection('events').find(
            {"__id" :  eventId})  //returns a Promise
    }

    get_all_events()
    {
        return DB.db.collection('events').find().toArray()  //returns a Promise
    }









}

module.exports = new eventDAO()
