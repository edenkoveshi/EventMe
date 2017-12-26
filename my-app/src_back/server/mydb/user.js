

class  user
{
    constructor(fb_id, first_name, last_name, friends_list){
        this.fb_id = fb_id
        this.first_name = first_name
        this.last_name = last_name
        this.friends_list = friends_list
        this.open_friends_events = []
        this.invited_events = []
        this.going_events = []
        this.own_public_events = []
        this.own_private_events = []
        this.created_events = 0
    }
}

module.exports = user
