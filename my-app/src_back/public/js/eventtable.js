var myList = [
  { "name": "abc", "age": 50, "nickname": "hey", "activity": "sport", "favorite bend": "beatles" },
  { "age": "25", "hobby": "swimming" },
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}, 
  { "name": "xyz", "hobby": "programming"}
];


function boxChecked(t) {
  if (t.is(':checked')) {
    myList.push({ "child": "abc", "age": 50 });
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable');
  }
}


// Builds the HTML Table out of myList.
function buildEventsTable(selector) {
  $(selector).append($('<caption>'+"Events"+'</caption>'));
  var columns = addAllColumnHeaders(myList, selector);
  for (var i = 0; i < myList.length; i++) {

    var row$ = $('<tr>');

    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      if (columns[colIndex] == "name") {
        row$.append($('<td>'+'<a href="event.html">'+cellValue+'</a>'+'</td>'+'</tr>'));
      } else {
        row$.append($('<td>'+cellValue+'</td>'+'</tr>'));
      }
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

  for (var i = 0; i < myList.length; i++) {
    var rowHash = myList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);

  return columnSet;
}