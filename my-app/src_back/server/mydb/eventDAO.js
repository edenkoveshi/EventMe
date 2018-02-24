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
            {"eventId" :  eventId}).toArray()  //returns a Promise
    }

    get_all_events()
    {
        return DB.db.collection('events').find().toArray()  //returns a Promise
    }

    update_event(event_id, updeted_event)
    {
        console.log(updeted_event)
        return DB.db.collection('events').updateOne({'eventId' : event_id},updeted_event) //returns a Promise
    }

    remove_event(event_id)
    {
        console.log('DAO - deleting event:', event_id)
        return DB.db.collection('events').deleteOne(
            {"eventId" :  event_id})
    }

    leave_event(event_id, user_id, user_name)
    {
        console.log('DAO trying to leave event')
        console.log(event_id);
        console.log(user_id);
        console.log(user_name);
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$pull: {goingName: user_name}},
            {multi: false}
        )
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$pull: {going_users: user_id}},
            {multi: false}
        )
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$push: {invitedName: user_name}},
            {multi: false}
        )
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$push: {invited_users: user_id}},
            {multi: false}
        )
        console.log('DAO finsihed leave event fun');
    }

    join_event(event_id, user_id, user_name)
    {
        console.log('DAO trying to join event');
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$pull: {invitedName: user_name}},
            {multi: false}
        );
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$pull: {invited_users: user_id}},
            {multi: false}
        );
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$push: {goingName: user_name}},
            {multi: false}
        );
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$push: {going_users: user_id}},
            {multi: false}
        );
        console.log('DAO finsihed join event fun');
    }

    change_vote0(event_id, user_id, vote, loc, new_vote)
    {

        if(loc == 0){
            decresevote00(event_id, user_id, new_vote);
        }else if(loc == 1){
            decresevote01(event_id, user_id, new_vote);
        }else if(loc == 2){
            decresevote02(event_id, user_id, new_vote);
        }else{
            decresevote03(event_id, user_id, new_vote);
        }
        if(new_vote){
            console.log('DAO 0- adding vote');
            DB.db.collection('events').updateOne
            (
                {'eventId' : event_id},
                {$push:{"pollArray.0.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }else{
            console.log('DAO 0- removing vote');
            DB.db.collection('events').updateOne
            (

                {'eventId' : event_id},
                {$pull:{"pollArray.0.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }
        console.log('DAO - finished removing vote');
    }
    change_vote1(event_id, user_id, vote, loc, new_vote)
    {
        if(loc == 0){
            decresevote10(event_id, user_id, new_vote);
        }else if(loc == 1){
            decresevote11(event_id, user_id, new_vote);
        }else if(loc == 2){
            decresevote12(event_id, user_id, new_vote);
        }else {
            decresevote13(event_id, user_id, new_vote);
        }
        if(new_vote){
            console.log('DAO 1- adding vote');
            DB.db.collection('events').updateOne
            (
                {'eventId' : event_id},
                {$push:{"pollArray.1.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }else{
            console.log('DAO 1- removing vote');
            DB.db.collection('events').updateOne
            (
                {'eventId' : event_id},
                {$pull:{"pollArray.1.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }
        console.log('DAO - finished removing vote');
    }
    change_vote2(event_id, user_id, vote, loc, new_vote)
    {
        if(loc == 0){
            decresevote20(event_id, user_id, new_vote);
        }else if(loc == 1){
            decresevote21(event_id, user_id, new_vote);
        }else if(loc == 2){
            decresevote22(event_id, user_id, new_vote);
        }else {
            decresevote23(event_id, user_id, new_vote);
        }
        if(new_vote){
            console.log('DAO 2- adding vote');
            DB.db.collection('events').updateOne
            (
                {'eventId' : event_id},
                {$push:{"pollArray.2.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }else{
            console.log('DAO 2- removing vote');
            DB.db.collection('events').updateOne
            (
                {'eventId' : event_id},
                {$pull:{"pollArray.2.voted_users" : {user : user_id , vote : vote}}},
                {multi: false}
            );
        }
        console.log('DAO - finished removing vote');
    }

}

function decresevote00(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.0.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.0.votes": -1}}
        );
    }
}
function decresevote01(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.1.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.1.votes": -1}}
        );
    }

}
function decresevote02(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.2.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.2.votes": -1}}
        );
    }

}
function decresevote03(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.3.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.0.options.3.votes": -1}}
        );
    }
}


function decresevote10(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.0.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.0.votes": -1}}
        );
    }
}
function decresevote11(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.1.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.1.votes": -1}}
        );
    }
}
function decresevote12(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.2.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.2.votes": -1}}
        );
    }
}
function decresevote13(event_id, user_id, new_vote)
{
    if(new_vote){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.3.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.1.options.3.votes": -1}}
        );
    }
}


function decresevote20(event_id, user_id, new_user)
{
    if(new_user){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.0.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.0.votes": -1}}
        );
    }
}
function decresevote21(event_id, user_id, new_user)
{
    if(new_user){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.1.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.1.votes": -1}}
        );
    }
}
function decresevote22(event_id, user_id, new_user)
{
    if(new_user){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.2.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.2.votes": -1}}
        );
    }
}
function decresevote23(event_id, user_id,new_user)
{
    if(new_user){
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.3.votes": 1}}
        );
    }else{
        DB.db.collection('events').updateOne
        (
            {'eventId' : event_id},
            {$inc:{"pollArray.2.options.3.votes": -1}}
        );
    }
}
module.exports = new eventDAO()
