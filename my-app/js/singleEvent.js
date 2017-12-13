var myEvent = {
    "name": "Italian Monday",
    "img": "img\\restaurant.jpeg",
    "hobby": "Restaurant",
    "location": "Ibn Gabirol Street 100",
    "time":"20:30",
    "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis gravida nunc, nec semper erat ultricies at. " +
    "Donec sed dui quis risus laoreet ultricies ac ac est. Morbi auctor metus a eros tincidunt, eget sollicitudin lorem consequat. " +
    "Aenean consequat elit tortor, quis aliquet velit tempor vel. Nulla blandit auctor posuere." +
    "Aliquam erat volutpat. Suspendisse eu metus vel nulla ornare commodo at at augue." +
    "Vestibulum varius tortor metus, sodales accumsan libero finibus sit amet. Nulla imperdiet tristique pulvinar. " +
    "Sed porta est in purus ultrices, a tincidunt justo rutrum. In hac habitasse platea dictumst."
};

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
// Builds the HTML Table out of myList.
function buildEventTable(selector) {
    var rows = "";
    rows = rows + '<tr style="background-color:#f9f1e9;border-width: 0">';
    rows = rows + '<td style="border-width: 0;width: 250px; height: 125px;"><img height=200px, width=300px src="'+ myEvent["img"]+'" /></td>';
    rows = rows + '<td style="border-width: 0;width: 450px; height: 125px;"><span style="text-align:center;color:black"><H3>' + myEvent["name"] + '</H3></span></td></tr>';

    rows = rows + '<tr style="height: 125px;background-color:#f9f1e9;border-width: 0">';
    rows = rows + '<td style="text-align:center;border-width: 0;width: 266.111px; height: 125px;">';
    rows = rows + '<h4 style="color:black;weight:bold;"> You going?<br /> </h4><a href="javascript:alert()"><img height=60px, width=60px src="img\\tick.png" /></a></td>';
    rows = rows + '<td style="border-width: 0;width: 450px; height: 125px;"><span style="color:black"><p>When: '+myEvent["time"] +'</p><p>Where: ' + myEvent["location"] +'</p><p>What: '+ myEvent["hobby"]+'</p>';
    rows = rows + '</span></td>';
    rows = rows + '</tr>';
    rows = rows + '<tr style="height: 125px;background-color:#f9f1e9;border-color: #f9f1e9"><td style="border-width: 0;width: 250px; height: 125px;">&nbsp;</td>';
    rows = rows + '<td><p><span style="color:black">' + myEvent["info"];
    rows = rows + '</span></p></td>';
    rows = rows + '</tr>';

    document.getElementById(selector).innerHTML = rows;
    //alert("HI");

}