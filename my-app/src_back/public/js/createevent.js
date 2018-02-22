var map;
var markers = [];
var location_poll = [];

$(document).ready(function () {
    //----Set onclick functions for time&date buttons-------
    var today = document.getElementById('Today');
    var tommorow = document.getElementById('Tommorow');
    var morning = document.getElementById('Morning');
    var noon = document.getElementById('Noon');
    var evening = document.getElementById('Evening');
    today.onclick = function () {
        var date = new Date();
        var time = document.getElementById('event-time').value;
        if (time != "")//if time is specified already,do not change it
        {
            date.setHours(parseInt(time.split('T')[1].split(':')[0]) + 2);//takes -2 for some reason
            date.setMinutes(parseInt(time.split('T')[1].split(':')[1]));
        }
        SetDate(date);
    }
    tommorow.onclick = function () {
        var date = new Date();
        var time = document.getElementById('event-time').value;
        if (time != "") {
            date.setHours(parseInt(time.split('T')[1].split(':')[0]) + 2);
            date.setMinutes(parseInt(time.split('T')[1].split(':')[1]));
        }
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        if (month == 11 && day == 31) //end of year
        {
            date.setFullYear(year + 1);
            date.setMonth(0);
            date.setDate(1);
        }
        else if ((day == 31 && (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9)) || (day == 30 && (month == 3 || month == 5 || month == 8 || month == 10)))//end of month,does not include Dec.(end of year) or Feb.(special case)
        {
            date.setDate(1);
            date.setMonth(month + 1);
        }
        else if (month == 1 && day == 28) {
            if (year % 4 == 0) {
                if (year % 100 == 0) {
                    if (year % 400 != 0)//feb. has 28 days
                    {
                        date.setDate(1);
                        date.setMonth(2);
                    }
                    else {
                        date.setDate(29);
                    }
                }
                else {
                    date.setDate(29);
                }
            }
        }
        else if (month == 1 && day == 29) {
            date.setDate(1);
            date.setMonth(2);
        }
        else//not end of month,year
        {
            date.setDate(day + 1);
        }
        SetDate(date);
    }
    morning.onclick = function () {
        var time = document.getElementById('event-time').value;
        if (time == "")//if time&date is not specified,set default date for today's date
        {
            time = new Date();
            time = time.toISOString();
        }
        var date = parseISOString(time);
        date.setHours(11);
        date.setMinutes(0);
        SetDate(date);
    }
    noon.onclick = function () {
        var time = document.getElementById('event-time').value;
        if (time == "") {
            time = new Date();
            time = time.toISOString();
        }
        var date = parseISOString(time);
        date.setHours(17);
        date.setMinutes(0);
        SetDate(date);
    }
    evening.onclick = function () {
        var time = document.getElementById('event-time').value;
        if (time == "") {
            time = new Date();
            time = time.toISOString();
        }
        var date = parseISOString(time);
        date.setHours(23);
        date.setMinutes(0);
        SetDate(date);
    }

});

//Set date&time in input field
function SetDate(date) {
    var time = document.getElementById('event-time');
    var isodate = date.toISOString();
    time.value = isodate.substring(0, isodate.length - 8);//remove sec and millisec
}

//Parse ISO formatted string to Date object
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], 0, 0));
}

//var location;
function ChooseLocation() {
    // Get the modal
    var modal = document.getElementById('maps-modal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    modal.style.display = "block";
    google.maps.event.trigger(map, 'resize');

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        if (LocationPollCheck() && !window.confirm('Save changes?')) {
            document.getElementById('locations-list').value = "";
            location_poll = [];
            for (var i = 0; i < markers.length; i++)
                markers[i].setMap(null);
        }
        else if (LocationPollCheck()) {
            document.getElementById('locations-list').value = JSON.stringify(location_poll);
            //.alert(JSON.stringify(location_poll));
        }
        modal.style.display = "none";
    }
}

function SelectType() {
    //change button label
    var but = document.getElementById("Type_selection");
    but.value = (but.value == "Click here") ? "Close list" : "Click here";
    //toggle list view
    var list = document.getElementById("activity-type");
    list.style.display = (list.style.display == "none") ? list.style.display = "inline" : list.style.display = "none";
}

//Google Maps function
function initMap(event) {
    $(document).ready(function () {
        // ----- MAP CREATION -------
        var location_no_poll = document.getElementsByName("google-location")[0];
        var user_loc='0';
        if(location_no_poll!=undefined && location_no_poll.value!="") user_loc=location_no_poll.value;
        var default_location = {lat: 32.07005626883245, lng: 34.79411959648132};
        location_no_poll.value = '(32.07005626883245,34.79411959648132)';
        map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 15,
            center: default_location,
        });

        //---MARKER CREATION ----
        var marker = new google.maps.Marker({
            position: default_location,
            map: null,
            icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569'
        });
        if (!LocationPollCheck()) {
            marker.setMap(map);
        }
        //----- SEARCH BAR CREATION -----
        //--creation--
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        // ------ GET CURRENT LOCATION ------
        var current_location;
        var Location = new Promise(function (resolve, reject) {
            //Get current location using geolocation service
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(JSON.stringify(pos));
                });
            }
        });

        Location.then(function (result) {
            //Adjust map
            result = JSON.parse(result);
            current_location=result;
            map.setCenter(result);
            if (!LocationPollCheck()) {
                marker.setPosition(result);
                marker.setMap(map);
                location_no_poll.value = "(" + result.lat + ", " + result.lng + ')';
            }
            google.maps.event.trigger(map, "resize");
        });

        if(user_loc!='0')
        {
            map.setCenter(user_loc);
            location_no_poll.value=user_loc;
        }

        //-------------- CHANGE LOCATION ON CLICK ------
        google.maps.event.addListener(map, 'click', function (event) {
            var loc = event.latLng;
            if (!LocationPollCheck()) {
                marker.setPosition(loc);
                marker.setMap(map);
                location_no_poll.value = loc;
                for (i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                location_poll = [];
            }
            else {
                if (window.confirm('Choose this location?')) {
                    if (markers.length > 16)
                        window.alert('You have reached maximal number of locations');
                    else {
                        var newMarker = new google.maps.Marker({
                            position: loc,
                            map: map,
                            icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFFFF',
                        });
                        markers.push(newMarker);
                        marker.setMap(null);
                        location_no_poll.value = "";
                        location_poll.push(loc + " ");
                    }
                }
            }
            map.setCenter(loc);
            google.maps.event.trigger(map, "resize");
        });

        //-------------- SEARCH BAR HANDLING --------------------
        //--response to user choice--
        //var markers = [];
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length ==0){
                window.alert('Invalid address.Please try again');
                return;
            }
            //get details of each place
            if(places.length>1) //if query matches more than one place, choose closest one
            {
                var min=CalcDistance(places[0].geometry.location,current_location);
                var chosen_place=places[0]
                for(var i=1;i<places.length;i++)
                {
                    var dist=CalcDistance(places[i].geometry.location,current_location);
                    if(dist<min)
                    {
                        min=dist;
                        chosen_place=places[i];
                    }
                }
                places=[];
                places.push(chosen_place);

            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                // Create a marker for each place.
                if (LocationPollCheck()) {
                    if (window.confirm('Choose this location?')) {
                        if (markers.length > 16)
                            window.alert('You have reached maximal number of locations');
                        else {
                            markers.push(new google.maps.Marker({
                                map: map,
                                icon: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFFFF',
                                title: place.name,
                                position: place.geometry.location

                            }));
                            marker.setMap(null);
                            location_poll.push(place.geometry.location + " ");
                            location_no_poll.value = "";
                        }
                    }
                }
                else {
                    marker.setPosition(place.geometry.location);
                    marker.setMap(map);
                    location_no_poll.value = place.geometry.location;
                    location_poll.value = "";
                    for (i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                }
                map.setCenter(place.geometry.location);
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    });
}

/*function handleLocationError() {
    window.alert("We have a problem fetching your location.Please check it and try again later.");
}*/

function LocationPollCheck() {
    return ($('#location-cb').is(':checked'));
}

function Poll() { // Get the modal
    var modal = document.getElementById('poll-modal');
    var button = document.getElementById('poll');

    // When the user clicks the button, open the modal
    modal.style.display = (modal.style.display == "none") ? "block" : "none";
    button.value = (button.value == "Poll!") ? "Close" : "Poll!";


    $(document).ready(function () {
        //-----Hide relevant elements when poll checkboxes are checked-----------
        $("#location-cb").click(function () {
                $("#Activity_location").toggle(!this.checked);
                p = document.getElementById('location-polled');
                p.innerHTML = (p.innerHTML == "Under poll") ? "(Current location will be taken as default)" : "Under poll";
                $('#location-options').toggle(this.checked);

            }
        )
        $('#time-cb').click(function () {
            $('#event-time').toggle(!this.checked);
            p = document.getElementById('time-polled');
            p.innerHTML = (p.innerHTML == "Date and time: Under poll") ? "Date and time" : "Date and time: Under poll";
            $('#time-options').toggle(this.checked);
            $('#Today').toggle(!this.checked);
            $('#Tommorow').toggle(!this.checked);
            $('#Morning').toggle(!this.checked);
            $('#Noon').toggle(!this.checked);
            $('#Evening').toggle(!this.checked);
            var add_options = document.getElementById('add-options');
            if (add_options == undefined) {
                var but = document.createElement('input');
                but.type = 'button';
                but.onclick = AddDateAndTime;
                but.value = 'Add more options!';
                but.id = 'add-options';
                $('#time-options').append(but);
                document.getElementById('event-time').value = "";
                AddDateAndTime();
            }
        })

        $('#free-poll-cb').click(function () {
            $('#free-poll-options').toggle(this.checked);
        })


    });

}

//Add date and time objects,used for date and time polls
function AddDateAndTime() {
    $("<input type=datetime-local name='time-poll-option'/>").insertBefore($('#add-options'));
    $("<input type=datetime-local name='time-poll-option'/>").insertBefore($('#add-options'));
}

//Same here for free polls
function AddFreePollOptions() {
    $("<input type=text name='free-poll-option'/>").insertBefore($('#free-poll-button'));
    $("<br>").insertBefore($('#free-poll-button'));
}

function CalcDistance(location1,location2)
{
    //-----------Calculate distance between event and user locations---------------
    var R = 6371e3; // metres
    var lat1 = location1.lat;
    var lon1 = location1.lng;
    var lat2 = location2.lat;
    var lon2 = location2.lng;
    var φ1 = radians(lat1);
    var φ2 = radians(lat2);
    var Δφ = radians(lat2 - lat1);
    var Δλ = radians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    d = Math.round(d * 100) / 100;

    return (parseInt(d/100))/10 +'km';



}

function radians(x) {
    var pi = Math.PI;
    return x * (pi / 180);
}

//Time validation function
function ValidateTime(time) {
    var chosen = parseISOString(time);
    var current = new Date();
    if (chosen.getTime() - current.getTime() < 3540000) return 0;//a gap of approx. 1 hour is enforced here
    return 1;
}


//----------Validate all fields,submit if everything is okay--------------
function CreateEvent() {
    var location_under_poll = ($('#location-cb').is(':checked')) ? 1 : 0;
    var time_under_poll = ($('#time-cb').is(':checked')) ? 1 : 0;
    var polls_valid = 1; //1 iff polls are valid - at least 2 options
    var all_fields_set = 1;
    var polls = [];
    var query = 'input[name="Activity_name"]';
    //Check location and time fields if they aren't under poll
    if (!location_under_poll) {
        query += ',input[name="google-location"]';
    }
    if (!time_under_poll)
        query += ',input[name="Activity_time"]';
    //Look up for all elements that aren't optional
    var form_input = document.querySelectorAll(query);
    for (i = 0; i < form_input.length; i++) {
        //if any of them is empty
        if (form_input[i].value == "") {
            all_fields_set = 0;
        }
    }

    //Look for checkboxes,make sure at least one is chekced
    var cblist = document.querySelectorAll('input[type="checkbox"]:checked');
    var str = "";
    for (i = 0; i < cblist.length; i++) {
        //concatenate all category checked boxes to a string
        if (cblist[i].id != "location-cb" && cblist[i].id != "time-cb" && cblist[i].id != "free-poll-cb") {
            str += "," + cblist[i].id;
        }
    }
    if (str.length == 0)//type was not chosen,'Other' set as default
    {
        str = " Other"; //whitespace is to fit with the next line
    }
    document.getElementsByName("categories")[0].value = str.substring(1, str.length);

    //Validate polls
    if (location_under_poll) {
        var locations = document.getElementById('locations-list').value;
        var res = JSON.parse(locations);
        if (res.length < 2) {
            polls_valid = 0;
        }
    }

    if (time_under_poll) {
        var all_options = document.getElementsByName('time-poll-option');
        if (all_options.length < 2) {
            polls_valid = 0;
        }
        else {
            var count = 0;
            for (var i = 0; i < all_options.length; i++) {
                if (all_options[i] == undefined) {
                    polls_valid = 0;
                    break;
                }
                if (all_options[i].value != "") {
                    count++;
                }
                for (var j = i + 1; j < all_options.length; j++) {
                    if (all_options[j] == undefined) {
                        polls_valid = 0;
                        break;
                    }
                    if (all_options[j].value == all_options[i].value && all_options[i].value != "") {
                        window.alert("Poll options must be different!");
                        polls_valid = 0;
                        break;
                    }
                }
            }
            if (count < 2) polls_valid = 0;
        }
    }


    if ($('#free-poll-cb').is(':checked')) {
        var all_options = document.getElementsByName('free-poll-option');
        if (all_options.length < 2) {
            polls_valid = 0;
        }
        else {
            var count = 0;
            for (var i = 0; i < all_options.length; i++) {
                if (all_options[i] == undefined) {
                    polls_valid = 0;
                    break;
                }
                if (all_options[i].value != "") {
                    count++;
                }
                for (var j = i + 1; j < all_options.length; j++) {
                    if (all_options[j] == undefined) {
                        polls_valid = 0;
                        break;
                    }
                    if (all_options[j].value == all_options[i].value && all_options[i].value != "") {
                        window.alert("Poll options must be different!");
                        polls_valid = 0;
                        break;
                    }
                }
            }
            if (count < 2) polls_valid = 0;
        }
    }

    //Look up for a picture
    /*var file=document.getElementsByName("picture")[0].value;
    if(file!="") //If field isn't empty
    {
        var format=file.split(".")[1];
        if(format!="png" && format!="jpg") { //make sure format is okay
            window.alert("Picture format is not valid");
            all_fields_set = 0;
        }
    }*/

    //Validate chosen date(s)
    {
        var flag = 1;
        if (time_under_poll) {
            var dates = document.getElementsByName('time-poll-option');
            dates.forEach(function (item, index) {
                if (!ValidateTime(item.value)) flag = 0;
            });
        }
        else {
            var date = document.getElementById('event-time');
            if (!ValidateTime(date.value)) {
                flag = 0;
            }
        }
        if (!flag) {
            all_fields_set = 0;
            window.alert("You have chosen an invalid date(s).");
        }
    }


    //If everything is okay submit form, err otherwise
    var poll_questions = [];
    if (all_fields_set == 1 && polls_valid) {
        window.alert("Event created successfully!");
        var poll_counter = 0;
        if ($('#location-cb').is(':checked')) {
            polls.push(JSON.parse(document.getElementById('locations-list').value));
            poll_counter++;
            poll_questions.push("Where should we go?");
        }

        if ($('#time-cb').is(':checked')) {
            var options = document.getElementsByName('time-poll-option');
            var values = [];
            for (var i = 0; i < options.length; i++)
                if (options[i].value != "")
                    values.push(options[i].value);
            polls.push(values);
            poll_counter++;
            poll_questions.push("When is the best time for us?");
        }

        if ($('#free-poll-cb').is(':checked')) {
            var options = document.getElementsByName('free-poll-option');
            var values = [];
            for (var i = 0; i < options.length; i++)
                if (options[i].value != "")
                    values.push(options[i].value);
            polls.push(values);
            poll_questions.push(document.getElementById('free-poll-question').value);
            poll_counter++;
        }
        var poll_1_length = (polls[0] == undefined) ? 0 : polls[0].length;
        var poll_2_length = (polls[1] == undefined) ? 0 : polls[1].length;
        var poll_3_length = (polls[2] == undefined) ? 0 : polls[2].length;

        var poll_1 = JSON.stringify(polls[0]);
        var poll_2 = JSON.stringify(polls[1]);
        var poll_3 = JSON.stringify(polls[2]);

        $("<input type='hidden' name='poll1' value='" + poll_1 + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll2' value='" + poll_2 + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll3' value='" + poll_3 + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll1_length' value='" + poll_1_length + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll2_length' value='" + poll_2_length + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll3_length' value='" + poll_3_length + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll1_question' value='" + poll_questions[0] + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll2_question' value='" + poll_questions[1] + "' />").insertBefore($('#Create'));
        $("<input type='hidden' name='poll3_question' value='" + poll_questions[2] + "' />").insertBefore($('#Create'));
        $('<input type="hidden" name="poll_counter" value="' + poll_counter + '"/>').insertBefore($('#Create'));

        document.getElementById("event-form").submit();
    }
    else if (polls_valid) {
        window.alert("Please fill all non-optional fields.");
    }
    else {
        window.alert("Polls require at least 2 options");
    }
}