var myList = [
  { "Category": "Food_Mexican", "Location": 345 },
  { "Category": "Food_Hamburger", "Location": 645 },
  { "Category": "Food_Italian", "Location": 375 },
  { "Category": "Food_Israeli", "Location": 385 },
  { "Category": "Food_Sushi", "Location": 349 },
  { "Category": "Food_Chinese", "Location": 335 }
];

function boxChecked(t) {
  if (t.is(':checked')) {
    var x = t.context.name;
    var myCurrentList = [];
    for (var listIndex = 0; listIndex < myList.length; listIndex++) {
      if (myList[listIndex]["Category"] == x) {
        myCurrentList.push(myList[listIndex]);
      }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
  }
}

function displaysearch() {
  myList.push({ "child": "abc", "age": 50 });
  $("#excelDataTable tr").remove();
  buildEventsTable('#excelDataTable', myCurrentList);
}

function buildEventsTableMain(selector) {
  buildEventsTable(selector, myList);
}

// Builds the HTML Table out of myList.
function buildEventsTable(selector, myList) {
  $(selector).append($('<caption>'+"Events"+'</caption>'));
  var columns = addAllColumnHeaders(myList, selector);
  for (var i = 0; i < myList.length; i++) {

    var row$ = $('<tr>');

    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      if (columns[colIndex] == "Category") {
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