$(function () {

  // grab session params
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log(params);
  $('#stand').val(params.stand);
  $('#plot').val(params.plot);

  // remove tree specific data from query results
  localStorage.setItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS, JSON.stringify({ stand: params.stand, plot: params.plot }));

  bindButtons();
});

function bindButtons() {
  var remeasureFormButton = $('#remeasure-form');
  remeasureFormButton.on('click', function() {odkTables.launchHTML(null, 'config/assets/tag_picker.html')});

  var ingrowthFormButton = $('#ingrowth-form');
  ingrowthFormButton.on('click', function () {odkTables.launchHTML(null, 'config/assets/ingrowth_form.html')});

  var missingTreesButton = $('#missing-trees');
  missingTreesButton.on('click', function () {odkTables.launchHTML(null, 'config/assets/missing_trees.html')});

  var remeasureListButton = $('#remeasure-list');
  remeasureListButton.on(
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

  var ingrowthListButton = $('#ingrowth-list');
  ingrowthListButton.on(
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

  var mortalityListButton = $('#mortality-list');
  mortalityListButton.on(
    'click',
    function () {
      odkTables.openTableToListView(
        null,
        'mortality',
        null,
        null,
        null);
    }
  );

  var prevDataListButton = $('#prev-data-list');
  prevDataListButton.on(
    'click',
    function () {
      odkTables.openTableToSpreadsheetView(
        null,
        'prev_data',
        null,
        null);
    }
  );
}
