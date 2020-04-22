$(function () {

  // grab stand and plot from session variables
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log('params');
  console.log(params);

  if (params) {
    // remove tree specific data from query results just to be safe
    let p = { type: params.type, stand: params.stand };
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) p.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(p));
    localStorage.setItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS, JSON.stringify({}));

    $('#stand').val(p.stand);
    $('#plot').val(p.plot);
  }


  bindButtons();
});

function bindButtons() {
  var remeasureFormButton = $('#stand-doc-form');
  remeasureFormButton.on('click', function() {odkTables.launchHTML(null, 'config/assets/stand_doc_form.html')});

  var remeasureFormButton = $('#remeasure-form');
  remeasureFormButton.on('click', function() {odkTables.launchHTML(null, 'config/assets/tag_picker.html')});

  var ingrowthFormButton = $('#ingrowth-form');
  ingrowthFormButton.on('click', function () {odkTables.launchHTML(null, 'config/assets/ingrowth_form.html')});

  var missingTreesButton = $('#missing-trees');
  missingTreesButton.on('click', function () {odkTables.launchHTML(null, 'config/assets/missing_trees.html')});

  var remeasureListButton = $('#measure-list');
  remeasureListButton.on(
    'click',
    function () {
      odkTables.openTableToListView(
        null,
        'measure',
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
