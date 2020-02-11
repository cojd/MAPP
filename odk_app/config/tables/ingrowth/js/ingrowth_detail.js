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
    console.log('ingrowth_detail getViewData CB error : ' + error);
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

    nullCaseHelper('plot',              '#FIELD_1');
    nullCaseHelper('tag',               '#FIELD_2');
    nullCaseHelper('species',           '#FIELD_3');
    nullCaseHelper('dbh',               '#FIELD_4');
    nullCaseHelper('status',            '#FIELD_5');
    nullCaseHelper('canopy_class',      '#FIELD_6');
    nullCaseHelper('crown_ratio',       '#FIELD_7');
    nullCaseHelper('overall_vigor',     '#FIELD_8');
    nullCaseHelper('main_stem',         '#FIELD_9');
    nullCaseHelper('rooting',           '#FIELD_10');
    nullCaseHelper('lean_angle',        '#FIELD_11');
    nullCaseHelper('crown_percentage',  '#FIELD_12');
    nullCaseHelper('tree_percentage',   '#FIELD_13');
    nullCaseHelper('from_tag',          '#FIELD_14');
    nullCaseHelper('distance',          '#FIELD_15');
    nullCaseHelper('azimuth',           '#FIELD_16');
    nullCaseHelper('comment_1',         '#FIELD_17');
    nullCaseHelper('comment_2',         '#FIELD_18');
    nullCaseHelper('comment_3',         '#FIELD_19');
    nullCaseHelper('comment_custom',    '#FIELD_20');
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
