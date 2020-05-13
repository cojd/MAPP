$(function () {

  // grab stand and plot from session variables
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log('params');
  console.log(params);

  let p = {}
  if (params) {
    // remove tree specific data from query results just to be safe
    p = { type: params.type, stand: params.stand };
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) p.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(p));
    localStorage.setItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS, JSON.stringify({}));

    $('#stand').val(p.stand);
    $('#plot').val(p.plot);
  }

  bindButtons(p);
});

function bindButtons(params) {
  // links to generic html pages
  var remeasureFormButton = $('#remeasure-form');
  remeasureFormButton.on('click', function () {
    odkTables.launchHTML(null, 'config/assets/tag_picker.html')
  });

  var ingrowthFormButton = $('#ingrowth-form');
  ingrowthFormButton.on('click', function () {
    Utils.save_value_to_params("form_def", "ingrowth");
    odkTables.launchHTML(null, 'config/assets/form.html')
  });

  var missingTreesButton = $('#missing-trees');
  missingTreesButton.on('click', function () {
    odkTables.launchHTML(null, 'config/assets/missing_trees.html')
  });

  var standDocFormButton = $('#stand-doc-form');
  standDocFormButton.on('click', function () {
    Utils.save_value_to_params("form_def", "stand_doc");
    odkTables.launchHTML(null, 'config/assets/form.html')
  });

  // for the list views we can set a filter on the DB query so we only get records matching the stand and plot if it is given
  let query = null, prev_query = null, selection_args = null;
  if (params) {
    query = 'stand=?';
    prev_query = 'StandID=?';                 // UNIFY THIS
    selection_args = [params.stand];
    if ('plot' in params) {
      query += ' AND plot=?';
      prev_query += ' AND Plot=?';            // PLEASE
      selection_args.push(params.plot);
    }
  }

  // links to Tables list views
  var remeasureListButton = $('#measure-list');
  remeasureListButton.on(
    'click',
    function () {
      Utils.save_value_to_params("form_def", "remeasure");
      Utils.save_value_to_params("editing", true);
      odkTables.openTableToListView(
        null,
        'measure',
        query,
        selection_args,
        null);
    }
  );


  var mortalityListButton = $('#mortality-list');
  mortalityListButton.on(
    'click',
    function () {
      Utils.save_value_to_params("form_def", "mortality");
      Utils.save_value_to_params("editing", true);
      odkTables.openTableToListView(
        null,
        'mortality',
        query,
        selection_args,
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
        prev_query,
        selection_args);
    }
  );

  var standDocListButton = $('#stand-doc-list');
  standDocListButton.on(
    'click',
    function () {
      Utils.save_value_to_params("form_def", "stand_doc");
      Utils.save_value_to_params("editing", true);
      odkTables.openTableToListView(
        null,
        'stand_doc',
        query,
        selection_args,
        null);
    }
  );

}
