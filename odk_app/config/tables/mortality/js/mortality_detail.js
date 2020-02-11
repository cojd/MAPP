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
    console.log('mortality_detail getViewData CB error : ' + error);
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

    nullCaseHelper('plot',               '#FIELD_1');
    nullCaseHelper('tag',                '#FIELD_2');
    nullCaseHelper('main_stem',          '#FIELD_3');
    nullCaseHelper('rooting',            '#FIELD_4');
    nullCaseHelper('lean_angle',         '#FIELD_5');
    nullCaseHelper('crown_percentage',   '#FIELD_6');
    nullCaseHelper('tree_percentage',    '#FIELD_7');
    nullCaseHelper('support_percentage', '#FIELD_8');
    nullCaseHelper('condition_1',        '#FIELD_9');
    nullCaseHelper('condition_2',        '#FIELD_10');
    nullCaseHelper('condition_3',        '#FIELD_11');
    nullCaseHelper('condition_4',        '#FIELD_12');
    nullCaseHelper('proximate',          '#FIELD_13');
    nullCaseHelper('predisposing',       '#FIELD_14');
    nullCaseHelper('comment_1',          '#FIELD_15');
    nullCaseHelper('comment_2',          '#FIELD_16');
    nullCaseHelper('comment_3',          '#FIELD_17');
    nullCaseHelper('comment_custom',     '#FIELD_18');
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
