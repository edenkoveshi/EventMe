

var myList = [
  { "name": "abc", "age": 50 },
  { "age": "25", "hobby": "swimming" },
  { "name": "xyz", "hobby": "programming" }
];

// Builds the HTML Table out of myList.
function buildHtmlTable(selector) {
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      if (columns[colIndex] == "name") {
        row$.append($('<td>'));
        row$.append($('<a href="#">').html(cellValue));
        row$.append($('</a>'));
        row$.append($('</td>'));
      } else {
        row$.append($('<td>').html(cellValue));
        row$.append($('</td>'));
      }
    }row$.append($('</tr>'));
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