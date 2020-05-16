let records = {};
let record_strings = {};

$(function () {
  // populate the status list
  let st = $('#status');
  if (st) {
    Utils.populateSelects((k, v) => { // gen options but filter out ingrowth
      if (v === DataLists.StatusList[2]) return false;
      return true;
    });
  }

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

  // watch the searchbar for when it changes so we can query the DB
  bindSearchChange(params);

  // grab the form and do custom submission logic
  watchForm(params);

});

function watchForm(params)
{
  let f = $('form#picker');
  f.submit((event) => {
    event.preventDefault();
    event.stopPropagation();

    // if a tree was properly selected
    if (f[0].checkValidity() === true) {
      // add tag and status to params
      let tag = $('input#tag').val();
      let status = $('select#status').val();
      let plot = $('#results').val();
      params.tag = tag;
      params.status = status; // status goes in params here since we select it in the UI not from the DB
      params.plot = plot;

      if (Number(params.status) === 6) params.form_def = 'mortality';
      else                             params.form_def = 'remeasure';
            
      console.log('params final');
      console.log(params);
      // store it in session variables
      localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(params));
      // store the queried tree data in session variables
      localStorage.setItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS, JSON.stringify(records[plot]));
      
      odkTables.launchHTML(null, 'config/assets/form.html') // move to the form
    }
    else f.addClass('was-validated'); // if form was invalid add class to show feedback
  });
}

////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// HANDLE DB QUERY
////////////////////////////////////////////////////////

function bindSearchChange(params)
{
  // query for the right plot type
  // requery when the tag input changes
  let qd = $('input#tag');
  qd.change(() => {
    switch (params.type) {
      case Constants.PlotTypes.REFERENCE_STAND:
        queryDB('prev_data', 'StandID=? AND Tag=?', [params.stand, qd.val()]);
        break;
      case Constants.PlotTypes.FIXED_RADIUS_PLOT:
        queryDB('prev_data', 'StandID=? AND Plot=? AND Tag=?', [params.stand, params.plot, qd.val()]);
        break;
      default:
        console.log("picker.js:bindSearchChange(): UNKNOWN PLOT TYPE!!!");
        break;
    }
  });
}

function queryDB(table, query, params) {
  var failureFn = function (errorMsg) {
    console.log(errorMsg); // puke and die
  }

  var successFn = function (result) {
    // iterate through the results to get the matching record
    records = {};
    record_strings = {};
    for (var row = 0; row < result.getCount(); row++) {
      var r = {};
      r['_id']        = result.getData(row, "_id");
      r['TreeID']     = result.getData(row, "TreeID");
      r['stand']      = result.getData(row, "StandID");
      r['plot']       = result.getData(row, "Plot");
      r['tag']        = result.getData(row, "Tag");
      r['PrevYear']   = result.getData(row, "PrevYear");
      r['species']    = result.getData(row, "Species");
      r['status']     = result.getData(row, "PrevStatus");
      r['dbh']        = result.getData(row, "PrevDBH");
      r['main_stem']  = result.getData(row, "PrevMS");
      r['rooting']    = result.getData(row, "PrevRT");
      r['lean_angle'] = result.getData(row, "PrevLA");
      r['comments']   = result.getData(row, "PrevComments");
      // records.push(r);
      // build a string from some of the values
      let st = 'Stand: ' + r.stand + ' | Plot: ' + r.plot + ' | Tag: ' + r.tag + ' | Status: ' + DataLists.StatusList[r.status]; 
      records[r.plot] = r;
      record_strings[r.plot] = st;
    }

    // grab the results div and set its value and validity depending on if we found a matching record
    let tag = $('input#tag')[0];
    let res_select = $('#results');
    res_select.html('<option value="">Please select a tree...</option>');
    if (records.length === 0) // we didn't get any records for that stand/plot/tag combo so the input is invalid
    { 
      tag.setCustomValidity('is-invalid');
    }
    else // we did get a record
    {
      res_select.append(Utils.genSelectOptions(record_strings));
      
      // if only one result just set the value of the select
      let keys = Object.keys(record_strings);
      if (keys.length === 1) res_select.val(keys[0]);
    }
  }

  // query the db
  odkData.query(table, query, params, null, null, '_savepoint_timestamp', 'DESC', 50, 0, null, successFn, failureFn);
}
