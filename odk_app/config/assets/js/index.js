$(function () {
  bindPlotSubmit($('#rs-submit'), 'rs', Constants.PlotTypes.REFERENCE_STAND);
  bindPlotSubmit($('#frp-submit'), 'frp', Constants.PlotTypes.FIXED_RADIUS_PLOT);

  loadDataIntoSelects();
});

function bindPlotSubmit(e, prefix, key)
{
  e.click(() => {
    let stand = $('#' + prefix + '_stand').val();
    let plot = $('#' + prefix + '_plot').val();
    let params = {
      'type': key,
      'stand': stand,
      'plot': plot,
    };
    console.log(JSON.stringify(params));
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(params));
    odkTables.launchHTML(params, 'config/assets/measure.html')
  });
}

/////////////////////////////////////////////////////////
function loadDataIntoSelects()
{
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  let standSuccess = function (result) {
    records = {};
    for (var row = 0; row < result.getCount(); row++) {
      let stand = result.getData(row, "StandID");
      records[stand] = stand;
    }
    
    // console.log(records);
    let st = Utils.genSelectOptions(records);
    $('#rs_stand').append(st);
    $('#frp_stand').append(st);
  }

  let standFailure = function (error) {
    alert("Stand DB query failed!\n\nIf you just pushed a config to the device, you'll probably need to reset the app configuration in settings.");
  }
  
  let plotSuccess = function (result) {
    records = {};
    for (var row = 0; row < result.getCount(); row++) {
      let plot = result.getData(row, "Plot");
      records[plot] = plot;
    }
    
    // console.log(records);
    let pl = Utils.genSelectOptions(records);
    $('#frp_plot').append(pl);
    
    // if there is only one plot just set it
    let keys = Object.keys(records);
    if (keys.length === 1) $('#frp_plot').val(keys[0]);
  }
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  // populate stand selects
  odkData.arbitraryQuery('prev_data', 'SELECT DISTINCT StandID FROM prev_data', [], null, null, standSuccess, standFailure);

  // populate plot select every time frp_stand changes value
  let frp_stand = $('#frp_stand');
  frp_stand.change(function () {
    let plot = $('#frp_plot').html('<option value="">Please select a plot...</option>');
    odkData.arbitraryQuery('prev_data', 'SELECT DISTINCT Plot FROM prev_data WHERE StandID=?', [frp_stand.val()], null, null, plotSuccess, console.log);
  });
}


