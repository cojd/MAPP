/* global $, odkTables, odkData, odkCommon */
'use strict';

$(function () {
  odkData.getViewData(success, cbFailure);

  let search = $('#tag-search');
  if (search.length) search.change(() => { // this search bar doesn't exist in the stand docs records list, only for measure and mortality
    let val = search.val();
    let records = $('.item_space');
    if (val)
    {
      let shown = 0;
      records.each(function(index) { // this probably wont perform very well if the list has a lot of records in it. this and pagination or requerying would probably be better
        let record = $(this);
        if (record.data('tag') == val)
        {
          record.show();
          shown++;
        }
        else record.hide();
      });
      if (shown > 0) $('.empty-message').hide();
      else $('.empty-message').show();
    }
    else 
    {
      records.show();
      if (records.length > 0) $('.empty-message').hide();
    }
  });
});

// Display the list of results
var success = function (resultSet) {
  // Retrieve the tableID from the query results
  var tableId = resultSet.getTableId();

  // Set the function to call when a list item is clicked
  $('.container').click(function (e) {

    // Retrieve the row ID from the item_space attribute
    let jqueryObject = $(e.target);
    let containingDiv = jqueryObject.closest('.item_space');
    let rowId = containingDiv.attr('rowId');
    let form_def = containingDiv.data('form_def');

    if (rowId !== null && rowId !== undefined) {
      Utils.save_value_to_params('rowId', rowId);
      Utils.save_value_to_params('form_def', form_def);
      // Opens the detail view from the file specified in
      // the properties worksheet
      odkTables.openDetailView(null, tableId, rowId, null);
    }
  });

  if (resultSet.getCount() > 0) $('.empty-message').hide();
  
  // Iterate through the query results, rendering list items
  for (var i = 0; i < resultSet.getCount(); i++) {
    if (tableId === 'stand_doc') appendStandDocItem(i, resultSet);
    else appendTreeItem(i, resultSet, tableId);
  }

  if (i < resultSet.getCount()) {
    setTimeout(resume, 0, i);
  }
};

var cbFailure = function (error) {
  console.log('getViewData error: ' + error);
};

function appendStandDocItem(row, resultSet) {
  // Creates the item space and stores the row ID in it
  var stand = resultSet.getData(row, 'stand');
  var update_directions = resultSet.getData(row, 'update_directions');
  let h = `
    <div class="card">
      <div class="card-body">
        Stand - ${stand}
        <div class="form-group">
          <textarea class="form-control" rows="3" readonly disabled>${update_directions}</textarea>
        </div>
      </div>
    </div>
    `;
  var item = $(h);
  item.attr('id', resultSet.getRowId(row));
  item.attr('rowId', resultSet.getRowId(row));
  item.data('form_def', 'stand_doc');
  item.addClass('item_space');

  // Add the item to the list
  $('.container').append(item);
}

function appendTreeItem(row, resultSet, tableId) {
  let is_mortality = tableId === "mortality";
  // Creates the item space and stores the row ID in it
  let tag = resultSet.getData(row, 'tag');
  var stand = resultSet.getData(row, 'stand');
  var plot = resultSet.getData(row, 'plot');
  var TreeID = resultSet.getData(row, 'TreeID');
  var species = resultSet.getData(row, 'species');
  var status = resultSet.getData(row, 'status');
  let h = `
    <div class="card">
      <div class="card-body">
        <h5>${tag} | <span class="badge badge-primary">${stand}</span> <span class="badge badge-success">${plot}</span></h5>
        ${(!is_mortality ? `<i>${DataLists.SpeciesList[species]}</i> - ${DataLists.StatusList[status]}` : '')}
      </div>
    </div>
    `;
  var item = $(h);
  item.attr('id', resultSet.getRowId(row));
  item.attr('rowId', resultSet.getRowId(row)); // dont think this is used
  item.data('tag', tag);
  item.addClass('item_space');

  if      (is_mortality) item.data('form_def', 'mortality');
  else if (status === 2) item.data('form_def', 'ingrowth');
  else                   item.data('form_def', 'remeasure')

  // Add the item to the list
  $('.container').append(item);
}
