$(function () {
  bindPlotSubmit($('#rs-submit'), 'rs', Constants.PlotTypes.REFERENCE_STAND);
  bindPlotSubmit($('#frp-submit'), 'frp', Constants.PlotTypes.FIXED_RADIUS_PLOT);
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
    odkCommon.setSessionVariable(Constants.SessionVariableKeys.SELECTION_PARAMS, JSON.stringify(params));
    window.location.replace('./measure.html');
  });
}
