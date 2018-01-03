var myList = new Array();

function getList(){

    $('#excelDataTable tr').each(function(row, tr){
        myList[row]={
            "type" : $(tr).find('td:eq(0)').text(),
            "eventId" : $(tr).find('td:eq(1)').text(),
            "title" :$(tr).find('td:eq(2)').text(),
            "distance" :$(tr).find('td:eq(3)').text(),
            "time" :$(tr).find('td:eq(4)').text(),
            "owner" :$(tr).find('td:eq(5)').text()
        }
    });
    return myList;
}
function boxChecked() {
    var myCurrentList = [];
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            var x = this.name;
            for (var listIndex = 0; listIndex < myList.length; listIndex++) {
                if (myList[listIndex]["type"] == x) {
                    myCurrentList.push(myList[listIndex]);
                }
            }
        }
    });
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function displaytime() {
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var myCurrentList = [];
    var x = (date + "T" + time);
    for (var listIndex = 0; listIndex < myList.length; listIndex++) {
        if (myList[listIndex]["time"] == x) {
            myCurrentList.push(myList[listIndex]);

        }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function displaysearch() {
    var myCurrentList = [];
        var x = $("#txt_name").val();
        for (var listIndex = 0; listIndex < myList.length; listIndex++) {
            if (myList[listIndex]["Category"] == x) {
                myCurrentList.push(myList[listIndex]);

        }
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
      var link = "/eventMe/event/" + myList[i]["eventId"]+ "/" + user_id;
      if (columns[colIndex] == "title") {
        row$.append($('<td>'+'<a href='+link+'>'+cellValue+'</a>'+'</td>'+'</tr>'));
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
  // $(selector).append($('<caption>'+"Events"+'</caption>'));
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