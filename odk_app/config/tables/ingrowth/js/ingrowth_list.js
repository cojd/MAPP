/* global $, odkTables, odkData, odkCommon */
'use strict';

// The first function called on load
var resumeFn = function () {

    // Retrieves the query data from the database
    // Sets displayGroup as the success callback
    // and cbFailure as the fail callback
    odkData.getViewData(displayGroup, cbFailure);
}

// Display the list of census results
var displayGroup = function (resultSet) {

    // Set the function to call when a list item is clicked
    $('#list').click(function (e) {

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
        var item = $('<li>');
        item.attr('id', resultSet.getRowId(i));
        item.attr('rowId', resultSet.getRowId(i));
        item.attr('class', 'item_space');

        // Display the plot id
        var plot = resultSet.getData(i, 'plot');
        if (plot === null || plot === undefined) {
            plot = 'unknown plot';
        }
        var tag = resultSet.getData(i, 'tag');
        if (tag === null || tag === undefined) {
            tag = 'unknown tag';
        }
        
        item.text('Plot: ' + plot + '\nTag: ' + tag);

        // Creates arrow icon
        var chevron = $('<img>');
        chevron.attr('src', odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
        chevron.attr('class', 'chevron');
        item.append(chevron);

        // Add the item to the list
        $('#list').append(item);

        // Don't append the last one to avoid the fencepost problem
        var borderDiv = $('<div>');
        borderDiv.addClass('divider');
        $('#list').append(borderDiv);
    }
    if (i < resultSet.getCount()) {
        setTimeout(resumeFn, 0, i);
    }
};

var cbFailure = function (error) {
    console.log('ingrowth getViewData CB error : ' + error);
};
