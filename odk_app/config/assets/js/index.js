'use strict';
/* global $, odkTables */
/* exported display */

/**
 * Responsible for rendering the home screen.
 */
function display() {

  var body = $('#main');
  // Set the background to be a picture.
  // body.css('background-image', 'url(img/teaBackground.jpg)');

  var remeasureFormButton = $('#remeasure-form');
  remeasureFormButton.on(
    'click',
    function () {
      odkTables.openTableToListView(
        null,
        'remeasure',
        null,
        null,
        null);
    }
  );
  
  var ingrowthFormButton = $('#ingrowth-form');
  ingrowthFormButton.on(
    'click',
    function () {
      odkTables.openTableToListView(
        null,
        'ingrowth',
        null,
        null,
        null);
    }
  );

  var mortalityFormButton = $('#mortality-form');
  mortalityFormButton.on(
    'click',
    function () {
      odkTables.openTableToListView(
        null,
        'mortality',
        null,
        null,
        'config/tables/mortality/html/mortality_list.html');
    }
  );
}
