var myList = [
    {"name": "A very special event", "img": "restaurant.jpeg", "hobby": "swimming"}
];

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
// Builds the HTML Table out of myList.
function buildEventTable(selector) {
    var row$ = $('<tr style="background-color:#f9f1e9;border-width: 0">');
    row$.append($('<td style="border-width: 0;width: 266.111px; height: 125.111px;"><img height=200px, width=300px src="img\\restaurant.jpeg" /></td>'));
    row$.append($('<td style="border-width: 0;width: 466.889px; height: 75.111px;"><span style="text-align:center;color:black"><H3>Italian Monday</H3></span></td>'));
    row$.append($('</tr>'));

    row$.append($('<tr style="height: 124px;background-color:#f9f1e9;border-width: 0">'));
    row$.append($('<td style="text-align:center;border-width: 0;width: 266.111px; height: 124px;">'));
    row$.append($('<h4 style="color:black;weight:bold;"> You going?<br /> </h4><a href="javascript:alert()"><img height=60px, width=60px src="img\\\\tick.png" /></a></td>'));
    row$.append($('<td style="border-width: 0;width: 466.889px; height: 124px;"><span style="color:black"><p>Where: 20:30</p><p>When: Ibn Gabirol Street 100</p><p>What: Restaurant</p>'));
    row$.append($('</span></td>'));
    row$.append($('</tr>'));
    //row$.append('<tr style="height: 124px;background-color:#f9f1e9;border-color: #f9f1e9"><td style="border-width: 0;width: 266.111px; height: 124px;">&nbsp;</td>'));
    //row$.append($('<p><span style="color:black">Some more info about the event.'));
    //row$.append($('</span></p></td>'));
    //row$.append($('</tr>'));


    $(selector).append(row$);
    alert("HI");

}