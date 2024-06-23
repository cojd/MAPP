$(function () {

  let f = $('#index-form');
  f.submit((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (f[0].checkValidity() === true) {
      let stand = $('#stand').val();
      let plot  = $('#plot').val();
      let params = {
        'type': (stand && plot ? Constants.PlotTypes.FIXED_RADIUS_PLOT : Constants.PlotTypes.REFERENCE_STAND),
        'stand': stand,
      };
      if (plot) params.plot = plot;

      console.log(JSON.stringify(params));
      localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(params));
      odkTables.launchHTML(params, 'config/assets/html/measure.html')
    }
    else f.addClass('was-validated');

  });

  loadDataIntoSelects();
});

///////////////////////////////////////////////////////// DB
function loadDataIntoSelects()
{
  /////////////////////////////////////////// CALLBACKS
  ///////////////////////////////////////////
  let standSuccess = function (result) {
    records = {};
    for (var row = 0; row < result.getCount(); row++) {
      let stand = result.getData(row, "StandID");
      records[stand] = stand;
    }
    
    // console.log(records);
    let st = Utils.genSelectOptions(records);
    $('#stand').append(st);
  }

  let standFailure = function (error) {
    alert("Stand DB query on previous data failed!\n\nIf you just pushed a config to the device, you'll probably need to reset the app configuration in settings.");
  }
  
  let plotSuccess = function (result) {
    records = {};
    for (var row = 0; row < result.getCount(); row++) {
      let plot = result.getData(row, "Plot");
      records[plot] = plot;
    }
    
    // console.log(records);
    let pl = Utils.genSelectOptions(records);
    $('#plot').append(pl);
    
    // if there is only one plot just set it
    let keys = Object.keys(records);
    if (keys.length === 1) $('#plot').val(keys[0]);
  }
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  // populate stand selects
  odkData.arbitraryQuery('prev_data', 'SELECT DISTINCT StandID FROM prev_data', [], null, null, standSuccess, standFailure);

  // populate plot select every time frp_stand changes value
  let stand = $('#stand');
  stand.change(function () {
    let plot = $('#plot').html('<option value="">Please select a plot... (optional)</option>');
    odkData.arbitraryQuery('prev_data', 'SELECT DISTINCT Plot FROM prev_data WHERE StandID=?', [stand.val()], null, null, plotSuccess, console.log);
  });
}


