/* global $, odkTables, odkData */
'use strict';

var resultSet = {};
var typeData = {};

// Called when the page loads
var display = function () {

    // Runs the query that launched this view
    odkData.getViewData(cbSuccess, cbFailure);
};

// Called when the query returns successfully
function cbSuccess(result) {

    resultSet = result;
    // and update the document with the values for this record
    updateContent();
}

function cbFailure(error) {

    // a real application would perhaps clear the document fiels if there were an error
    console.log('remeasure_detail getViewData CB error : ' + error);
}

/**
 * Assumes resultSet has valid content.
 *
 * Updates the document content with the information from the resultSet
 */
function updateContent() {
    // if (resultSet.get('species') === 'y') {
    //     $('#FIELD_1').attr('checked', true);
    // }

    nullCaseHelper('stand', '#FIELD_1');
    nullCaseHelper('plot', '#FIELD_2');
    nullCaseHelper('tag', '#FIELD_3');
    nullCaseHelper('dbh', '#FIELD_4');
    nullCaseHelper('overall_vigor', '#FIELD_5');
    nullCaseHelper('main_stem', '#FIELD_6');
    nullCaseHelper('rooting', '#FIELD_7');
    nullCaseHelper('lean_angle', '#FIELD_8');
    nullCaseHelper('crown_ratio', '#FIELD_9');
    nullCaseHelper('tree_percentage', '#FIELD_10');
    nullCaseHelper('comment_1', '#FIELD_11');
    nullCaseHelper('comment_2', '#FIELD_12');
    nullCaseHelper('comment_3', '#FIELD_13');
    nullCaseHelper('comment_custom', '#FIELD_14');
}

/**
 * Assumes resultSet has valid content
 *
 * Updates document field with the value for the elementKey
 */
function nullCaseHelper(elementKey, documentSelector) {
    var temp = resultSet.get(elementKey);
    if (temp !== null && temp !== undefined) {
        $(documentSelector).val(temp);
    }
}
