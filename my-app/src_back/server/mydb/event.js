

class  event
{
    constructor(event_id, ownerId, Title, location, type, information, time, invited, owner_name, invited_name, poll_counter, poll_array,poll_question){
        this.eventId = event_id
        this.ownerId = ownerId
        this.title = Title
        this.location = location
        this.type = type
        this.information = information
        this.time = time
        this.invited_users = invited
        this.going_users = []
        this.ownerName = owner_name
        this.invitedName = invited_name
        this.goingName = []
        this.pollCounter = poll_counter
        this.pollArray = poll_array
        this.pollQuestion =poll_question
    }
}

module.exports = event
