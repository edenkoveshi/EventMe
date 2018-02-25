

class  event
{
    constructor(event_id, ownerId, Title, location, type, information, time, invited, owner_name, invited_name, poll_counter, poll_array,poll_question){
        this.eventId = event_id;                    // event id
        this.ownerId = ownerId ;                    // the event's owner id
        this.title = Title;                         // the event's title / headline
        this.location = location;                   // the event's location. it will be empty if the there is a pol regarding the location
        this.type = type;                           // an array containing all of the "type tags" about the the event
        this.information = information;             // general inforamtion the owner decided to write about the event
        this.time = time ;                          // when the event will take place. it will be empty if the there is a pol regarding the time
        this.invited_users = invited;               // an array containing all of the usrs id that are invited to the event
        this.going_users = [ownerId];               // an array containing all of the usrs id that are going to the event -  the owner is automaticly going
        this.ownerName = owner_name;                // the event's owner name
        this.invitedName = invited_name ;           // an array containing all of the usrs id that are going to the event -  the owner is automaticly going
        this.goingName = [owner_name]  ;            // an array containing all of the usrs id that are going to the event -  the owner is automaticly going
        this.pollCounter = poll_counter;            // counts how many active polls are in the event
        this.pollArray = poll_array;                // an array containing all of the polls that are active - more about the polls in the poll.js file
        this.pool_results = '0'                     // display the "free poll" result,  0 otherwise
    }
}

module.exports = event
