

class  user
{
    constructor(fb_id, f_name, friends_list, location){
        this.fb_id = fb_id;                         // user main id
        this.f_name = f_name;                       // user full name
        this.friends_list = friends_list;           // an array containing all of the users friends
        this.open_friends_events = [];              // an array for future features
        this.invited_events = [] ;                  // an array containing all of the events that the user is invited to
        this.going_events = [];                     // an array containing all of the event that the user has accepted to attend (including his own events)
        this.own_public_events = [];                // an array containing all of the events that the user has created
        this.own_private_events = [];               // an array for future features
        this.created_events = 0;                    // counter for how many eents the user has created, it is used in order to determine the event id
        this.current_location = location;           // save the users current location;
        this.old_events = []                        // a hidden array that contains all of the events that the users has attended / was invited to
    }
}

module.exports = user
