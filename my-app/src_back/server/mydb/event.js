

class  event
{
    constructor(event_id, ownerId, Title, location, type, information, time, invited){
        this.eventId = event_id
        this.ownerId = ownerId
        this.title = Title
        this.location = location
        this.type = type
        this.information = information
        this.time = time
        this.invited_users = invited
        this.going_users = []
    }
}

module.exports = event
