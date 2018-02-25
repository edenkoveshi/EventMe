



class  poll
{
    constructor(owner_id, poll_question, options_array, array_length, poll_id){
        this.poll_id = poll_id;                                         // poll uniqe id
        this.owner_name = owner_id ;                                    // pol owner name
        this.poll_question = poll_question;                             // the question the the poll is trying to answer
        this.options = [];                                              // an array containing all of the options to vote for
                                                                        //each contains = {option: "the option", votes: "votes counter"}
        this.voted_users = []                                           // an array contains all of the user the votes and what they voted for
                                                                        // {user : "user_id}, vote : "the otion chosen"}
        for(var i=0;i<array_length;i++)
        {
            this.options[i] = {option: options_array[i] , votes: 0};
        }

        this.array_length = array_length;                                // tells you how man relavent options are there in the poll
        this.status = "open";                                            // tells f the poll is open or closed
        this.winner = "no winner defined yet";                           // conatins the winning option

    }
}

module.exports = poll
