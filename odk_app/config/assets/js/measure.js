const PARAMS = "PARAMS";

$(function () {
  let params = JSON.parse(odkCommon.getSessionVariable(PARAMS));
  console.log(params);
  $('#stand').val(params.stand);
  $('#plot').val(params.plot);
  $('#tag').val(params.tag);

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
        'config/tables/mortality/html/mortality_list.html');
    }
  );
}
