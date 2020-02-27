/* global $, odkTables, odkData */
'use strict';

$(function() {
  Utils.populateSelects();
  odkData.getViewData(success, failure);
});

function failure(error) {
  console.log('record_detail.js getViewData error: ' + error);
}

function success(result) {
                  // this must be a regular function not a arrow function
  $('[data-column-name]').each(function() {
    let key = $(this).data('column-name');
    let val = result.get(key);
    console.log('record_detail.js ' + key + ': ' + val);
    $('[data-column-name=\"' + key + '\"]').val(val);
  });

}

