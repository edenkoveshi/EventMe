    var getJSON = function(url) { //getting the data for the events from json
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(status);
                }
            };
            xhr.send();
        });
    };

    getJSON('https://www.googleapis.com/freebase/v1/text/en/bob_dylan').then(function(data) {
        alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug

        // result.innerText = data.result; // Ronnie: i need it?
											//display the result in an HTML element
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

// var myList = [
//   { "name": "abc", "age": 50 },
//   { "age": "25", "hobby": "swimming" },
//   { "name": "xyz", "hobby": "programming" }
// ];

var myList = getJSON('https://www.googleapis.com/freebase/v1/text/en/bob_dylan').result;

// Builds the HTML Table out of myList.
function buildHtmlTable(selector) {
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
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