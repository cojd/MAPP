/* global $, odkTables, odkData, odkCommon */
'use strict';

$(function(){
  resume();
});

// The first function called on load
function resume() {
  // Retrieves the query data from the database
  // Sets displayGroup as the success callback
  // and cbFailure as the fail callback
  odkData.getViewData(success, cbFailure);
};

// Display the list of census results
var success = function (resultSet) {

  // Set the function to call when a list item is clicked
  $('.container').click(function (e) {

    // Retrieve the row ID from the item_space attribute
    var jqueryObject = $(e.target);
    var containingDiv = jqueryObject.closest('.item_space');
    var rowId = containingDiv.attr('rowId');

    // Retrieve the tableID from the query results
    var tableId = resultSet.getTableId();

    if (rowId !== null && rowId !== undefined) {
      // Opens the detail view from the file specified in
      // the properties worksheet
      odkTables.openDetailView(null, tableId, rowId, null);
    }
  });

  // Iterate through the query results, rendering list items
  for (var i = 0; i < resultSet.getCount(); i++) {

    // Creates the item space and stores the row ID in it
    let tag = resultSet.get('tag');
    var stand = resultSet.getData(i, 'stand');
    var plot = resultSet.getData(i, 'plot');
    var TreeID = resultSet.getData(i, 'TreeID');
    var species = resultSet.getData(i, 'species');
    var status = resultSet.getData(i, 'status');
    let h = `
    <div class="card">
      <div class="card-body">
        <h5>` + tag + ` | <span class="badge badge-primary">` + stand + `</span> <span class="badge badge-success">` + plot + `</span> <span class="badge badge-info">` + TreeID + `</span></h5>
        <i>` + DataLists.SpeciesList[species] + `</i> - ` + DataLists.StatusList[status] + `
      </div>
    </div>
    `;
    var item = $(h);
    item.attr('id', resultSet.getRowId(i));
    item.attr('rowId', resultSet.getRowId(i));
    item.addClass('item_space');

    // Add the item to the list
    $('.container').append(item);

    // Don't append the last one to avoid the fencepost problem
    // var borderDiv = $('<div>');
    // borderDiv.addClass('divider');
    // $('.container').append(borderDiv);
  }
  if (i < resultSet.getCount()) {
    setTimeout(resume, 0, i);
  }
};

var cbFailure = function (error) {
  console.log('getViewData error: ' + error);
};
