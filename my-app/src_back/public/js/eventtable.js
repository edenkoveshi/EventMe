var myList = new Array();
var myTmpCurrentList = new Array();
var collapse_nav_open = false;

function getList(){

    $('#excelDataTable tr').each(function(row, tr){
        myList[row]={
            "Title" : $(tr).find('td:eq(0)').text(),
            "Distance" : $(tr).find('td:eq(1)').text(),
            "Event Id" :$(tr).find('td:eq(2)').text(),
            "Time" :$(tr).find('td:eq(3)').text(),
            "Type" : $(tr).find('td:eq(4)').attr('id'),
            "Owner" :$(tr).find('td:eq(5)').text(),

        }
    });
    for (var listIndex = 2; listIndex < myList.length; listIndex++) {
        if (!((myList[listIndex]["Distance"]).includes("km")) && myList[listIndex]["Distance"] !== "" && myList[listIndex]["Distance"] !== "under poll") {
            var tmpDistance = readyForDistance(myList[listIndex]["Distance"]);
            myList[listIndex]["Distance"] = tmpDistance;
        } else if (myList[listIndex]["Distance"] == "") {
            myList[listIndex]["Distance"] = "under poll";
        }
        this.myTmpCurrentList.push(myList[listIndex]);
    }
    return myList;
}

function csschange() {
    if (!collapse_nav_open) {
        collapse_nav_open = true;
        if (window.innerHeight < 420 && window.innerHeight > 320) {
            $('#excelDataTable tbody').css({
                'height': '150px'
            });

            $('#excelDataTable').css({
                'height': '50px'
            });
        }
        else if (window.innerHeight < 520 && window.innerHeight > 420) {
            $('#excelDataTable tbody').css({
                'height': '250px'
            });

            $('#excelDataTable').css({
                'height': '150px'
            });
        }
        else if (window.innerHeight < 650 && window.innerHeight > 520) {
            $('#excelDataTable tbody').css({
                'height': '350px'
            });

            $('#excelDataTable').css({
                'height': '250px'
            });
        }
        else if (window.innerHeight < 720 && window.innerHeight > 650) {
            $('#excelDataTable tbody').css({
                'height': '450px'
            });

            $('#excelDataTable').css({
                'height': '350px'
            });
        }
        else{
            $('#excelDataTable tbody').css({
                'height': '550px'
            });

            $('#excelDataTable').css({
                'height': '450px'
            });
        }
    } else {
        collapse_nav_open = false;

        if (window.innerHeight < 420 && window.innerHeight > 320) {
            $('#excelDataTable tbody').css({
                'height': '300px'
            });

            $('#excelDataTable').css({
                'height': '200px'
            });
        }
        else if (window.innerHeight < 520 && window.innerHeight > 420) {
            $('#excelDataTable tbody').css({
                'height': '400px'
            });

            $('#excelDataTable').css({
                'height': '300px'
            });
        }
        else if (window.innerHeight < 650 && window.innerHeight > 520) {
            $('#excelDataTable tbody').css({
                'height': '500px'
            });

            $('#excelDataTable').css({
                'height': '400px'
            });
        }
        else if (window.innerHeight < 720 && window.innerHeight > 650) {
            $('#excelDataTable tbody').css({
                'height': '630px'
            });

            $('#excelDataTable').css({
                'height': '530px'
            });
        }
        else if (window.innerHeight < 1220 && window.innerHeight > 720) {
            $('#excelDataTable tbody').css({
                'height': '700px'
            });

            $('#excelDataTable').css({
                'height': '600px'
            });
        }
        else if (window.innerHeight < 2120 && window.innerHeight > 1220) {
            $('#excelDataTable tbody').css({
                'height': '1200px'
            });

            $('#excelDataTable').css({
                'height': '1100px'
            });
        }
        else if (window.innerHeight < 3120 && window.innerHeight > 2120) {
            $('#excelDataTable tbody').css({
                'height': '2100px'
            });

            $('#excelDataTable').css({
                'height': '2000px'
            });
        }
        else if (window.innerHeight > 3120) {
            $('#excelDataTable tbody').css({
                'height': '3100px'
            });

            $('#excelDataTable').css({
                'height': '3000px'
            });
        }
    }
}


function boxChecked() {
    var myCurrentList = [];
    var numberchecked = 0;
    var alreadyIn = [];
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            numberchecked += 1;
            var x = this.name;
            for (var listIndex = 0; listIndex < myTmpCurrentList.length; listIndex++) {
                var event_types=myTmpCurrentList[listIndex]["Type"].split(',');
                for (var typesIndex = 0; typesIndex < event_types.length; typesIndex++) {
                    if (event_types[typesIndex] == x && alreadyIn.indexOf(listIndex) == -1) {
                        myCurrentList.push(myTmpCurrentList[listIndex]);
                        alreadyIn.push(listIndex);
                        break;
                    }
                }
            }
        }
    });
    if (numberchecked == 0){
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
    }
    this.myTmpCurrentList = []
    for (var listIndex = 0; listIndex < myCurrentList.length; listIndex++) {
        this.myTmpCurrentList.push(myCurrentList[listIndex]);
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function displayarrange() {
    var newList = [];
    for (var listIndex = 0; listIndex < myTmpCurrentList.length; listIndex++) {
        if (myTmpCurrentList[listIndex]["Distance"].indexOf("km") !== -1 || myTmpCurrentList[listIndex]["Distance"] !== "under poll") {
            newList.push(Object.assign({}, myTmpCurrentList[listIndex]));
        }
    }
    var distancecurr = 0;
    for (var listIndextmp = 0; listIndextmp < newList.length; listIndextmp++) {
        distancecurr = Number(newList[listIndextmp]["Distance"].replace("km",""));
        newList[listIndextmp]["Distance"] = distancecurr;
    }
    var newArrangeList = newList.sort(function(a,b) {return (a["Distance"] > b["Distance"]) ? 1 : ((b["Distance"] > a["Distance"]) ? -1 : 0);} );
    for (var listIndexSec = 0; listIndexSec < myTmpCurrentList.length; listIndexSec++) {
        if (myTmpCurrentList[listIndexSec]["Distance"].indexOf("km") == -1) {
            newArrangeList.push(myTmpCurrentList[listIndexSec]);
        }
    }
    for (var listIndextmpsec = 0; listIndextmpsec < newArrangeList.length; listIndextmpsec++) {
        if (typeof(newArrangeList[listIndextmpsec]["Distance"]) === 'number') {
            newArrangeList[listIndextmpsec]["Distance"] = newArrangeList[listIndextmpsec]["Distance"] + 'km';
        }
    }

    this.myTmpCurrentList = []
    for (var listIndex = 0; listIndex < newArrangeList.length; listIndex++) {
        this.myTmpCurrentList.push(newArrangeList[listIndex]);
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', newArrangeList);
}

function displaytime() {
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var myCurrentList = [];
    var x = (date + " " + time);
    var splittedTime = [];
    for (var listIndex = 0; listIndex < myTmpCurrentList.length; listIndex++) {
        splittedTime = myTmpCurrentList[listIndex]["Time"].split(" ");
        splittedTime_date = splittedTime[0].split("/");
        splittedTime[0] = splittedTime_date[2]+"-"+splittedTime_date[1]+"-"+splittedTime_date[0];
        if (time == "") {
            if (splittedTime[0] == date){
                myCurrentList.push(myTmpCurrentList[listIndex]);
            }
        } else if (date == "") {
            if (splittedTime[1] == time) {
                myCurrentList.push(myTmpCurrentList[listIndex]);
            }
        } else if (myTmpCurrentList[listIndex]["Time"] == x) {
            myCurrentList.push(myTmpCurrentList[listIndex]);
        }
    }
    if (x == " ") {
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
        // displaysearch();
    }
    this.myTmpCurrentList = []
    for (var listIndex = 0; listIndex < myCurrentList.length; listIndex++) {
        this.myTmpCurrentList.push(myCurrentList[listIndex]);
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);

}

function displaysearch() {
    var myCurrentList = [];
    var alreadyIn = [];
    var x = $("#txt_name").val();
    if (x != "") {
        for (var listIndex = 0; listIndex < myTmpCurrentList.length; listIndex++) {
            var event_types=myTmpCurrentList[listIndex]["Type"].split(',');
            var event_titles=myTmpCurrentList[listIndex]["Title"].split(',');
            for (var typesIndex = 0; typesIndex < event_types.length; typesIndex++) {
                if (event_types[typesIndex].toLowerCase().includes(x.toLowerCase()) && alreadyIn.indexOf(listIndex) == -1) {
                    myCurrentList.push(myTmpCurrentList[listIndex]);
                    alreadyIn.push(listIndex);
                    break;
                }
            }
            for (var titlesIndex = 0; titlesIndex < event_titles.length; titlesIndex++) {
                if (event_titles[titlesIndex].toLowerCase().includes(x.toLowerCase()) && alreadyIn.indexOf(listIndex) == -1) {
                    myCurrentList.push(myTmpCurrentList[listIndex]);
                    alreadyIn.push(listIndex);
                    break;
                }
            }
        }
    }
    else if (x == "") {
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
        // displaytime();
    }
    this.myTmpCurrentList = []
    for (var listIndex = 0; listIndex < myCurrentList.length; listIndex++) {
        this.myTmpCurrentList.push(myCurrentList[listIndex]);
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function buildEventsTableMain(selector, myList) {
    buildEventsTable(selector, myList);
}

// Builds the HTML Table out of myList.
function buildEventsTable(selector, myList) {
    var columns = addAllColumnHeaders(myList, selector);
    for (var i = 0; i < myList.length; i++) {

        var row$ = $('<tr>');

        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            var myHref = window.location.href;
            var arrayHref = myHref.split("/");
            var user_id = arrayHref[5];
            var link = "/eventMe/event/" + myList[i]["Event Id"]+ "/" + user_id;
            var hrefdelete = "/eventMe/delete_event/" + myList[i]["Event Id"]+ "/" +user_id;
            if (columns[colIndex] == "Title") {
                row$.append($('<td>'+'<a href='+link+'>'+cellValue+'</a>'+'</td>'));
            }
            else if (columns[colIndex] == "Type") {
                var types = cellValue.split(',');
                var types_put_already = new Array();
                for (var typeindex = 0; typeindex < types.length; typeindex++) {
                    var type = types[typeindex].split('_');
                    if (type.length > 1) {
                        if (!types_put_already.includes(" " + type[1])) {
                            types_put_already.push(" " + type[1]);
                        }
                    }
                    if (type.length == 1) {
                        if (!types_put_already.includes(" " + type[0])) {
                            types_put_already.push(" " + type[0]);
                        }
                    }
                }row$.append($('<td>' + types_put_already + '</td>'));
            }
            else if (columns[colIndex] == "Owner" && arrayHref[4] == "myownevents") {
                row$.append($('<td>'+cellValue+'</td>'));
                row$.append($('<td>'+'<a style="white-space: normal; background-color: rgba(248,131,121,0.8); color: black; border-color: black" class="btn btn-info btn-lg" href='+hrefdelete+'>delete</a>'+'</td>'+'</tr>'));
            }
            else {
                row$.append($('<td>'+cellValue+'</td>'));
            }
        }
        if (arrayHref[4] !== "myownevents") {
            row$.append($('<td>'+'</td>'+'</tr>'));
        }
        $(selector).append(row$);
    }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    var myHref = window.location.href;
    var arrayHref = myHref.split("/");
    var ifEmpty = ["Title", "Distance", "Time", "Type", "Owner"];
    if (myList.length == 0) {
        for (var i = 0; i < ifEmpty.length; i++) {
            if (ifEmpty[i] !== "Distance") {
                columnSet.push(ifEmpty[i]);
                headerTr$.append($('<th/>').html(ifEmpty[i]));
            }
            else if (ifEmpty[i] == "Distance") {
                headerTr$.append($('<th>' + '<button style="white-space: normal; background-color: rgba(248,131,121,0.8); color: black; border-color: black" class="btn btn-info btn-lg" onclick="displayarrange()"><span>Distance</span></button>' + '</th>'));
            }
        }
    }
    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1 && key !== "Event Id" && key !== "Distance"){
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
            else if ($.inArray(key, columnSet) == -1 && key == "Distance"){
                columnSet.push(key);
                headerTr$.append($('<th>' + '<button onclick="displayarrange()" style="white-space: normal; background-color: rgba(248,131,121,0.8); color: black; border-color: black" class="btn btn-info btn-lg"><span>Distance</span></button>' + '</th>' ));
            }
        }
    }
    headerTr$.append($('<th/>'));
    $(selector).append(headerTr$);

    return columnSet;
}

function readyForDistance(x){
    var event_loc=x;
    event_loc=event_loc.split(')');
    return CalcDistance(event_loc[0]);
}

function CalcDistance(x)
{
    //-----------Calculate distance between event and user locations---------------
    var R = 6371e3; // metres
    var coords = document.getElementById('user_location').innerHTML;
    /*
       var latlng=coords.split(',');
       var lat1=parseFloat(latlng[0].substr(1,latlng[0].length-1));
       var lon1=parseFloat(latlng[1].substr(1,latlng[1].length));
    */
    var lat1 = JSON.parse(coords).lat;
    //console.log(lat1);
    var lon1 = JSON.parse(coords).lng;
    //console.log(lon1);
    coords = x; //x should be event location taken from table
    var latlng = coords.split(',');
    //console.log (latlng);
    var lat2 = parseFloat(latlng[0].substr(1, latlng[0].length - 1));
    //console.log(lat2);
    var lon2 = parseFloat(latlng[1].substr(1, latlng[1].length));
    //console.log(lon2);
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