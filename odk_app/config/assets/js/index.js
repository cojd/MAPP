const PARAMS = "PARAMS";

$(function () {
  bindPlotSubmit($('#rs-submit'), 'rs');
  bindPlotSubmit($('#frp-submit'), 'frp');
});

function buildParams(prefix)
{
  
  return $.param(params);
}

function bindPlotSubmit(e, prefix)
{
  e.click(() => {
    let stand = $('#' + prefix + '_stand').val();
    let plot = $('#' + prefix + '_plot').val();
    let tag = $('#' + prefix + '_tag').val();
    let params = {
      'type': prefix,
      'stand': stand,
      'plot': plot,
      'tag': tag,
    };
    odkCommon.setSessionVariable(PARAMS, JSON.stringify(params));
    window.location.replace('./measure.html');
  });
}
