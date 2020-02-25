$(function () {
  // null out stored tree query data
  odkCommon.setSessionVariable(Constants.SessionVariableKeys.TREE_QUERY_RESULTS, JSON.stringify(null));

  // grab session params
  let params = JSON.parse(odkCommon.getSessionVariable(Constants.SessionVariableKeys.SELECTION_PARAMS));
  console.log(params);
  $('#stand').val(params.stand);
  $('#plot').val(params.plot);

  bindButtons();
});

function bindButtons() {
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
