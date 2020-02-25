let records = [];

$(function () {
  // populate the status list
  let st = $('#status');
  if (st) populateSelect(st, DataLists.StatusList, (k, v) => {
    if (v === DataLists.StatusList[2]) return false;
    return true;
  });
  
  // grab stand and plot from session variables
  var params = JSON.parse(odkCommon.getSessionVariable(Constants.SessionVariableKeys.SELECTION_PARAMS));
  console.log('params');
  console.log(params);
  if (params) {
    $('#stand').val(params.stand);
    $('#plot').val(params.plot);
  }

  // remove tree specific data from query results
  odkCommon.setSessionVariable(Constants.SessionVariableKeys.TREE_QUERY_RESULTS, JSON.stringify({ stand: params.stand, plot: params.plot }));

  // grab the form and do custom submission logic
  let f = $('form#picker');
  f.submit((event) => {
    event.preventDefault();
    event.stopPropagation();

    // if a tree was properly selected
    if (f[0].checkValidity() === true) {
      // add tag and status to params
      let tag = $('input#tag').val();
      let status = $('select#status').val();
      params.tag = tag;
      params.status = status;
      console.log('params final');
      console.log(params);
      // store it in session variables
      odkCommon.setSessionVariable(Constants.SessionVariableKeys.SELECTION_PARAMS, JSON.stringify(params));
      // store the queried tree data in session variables
      odkCommon.setSessionVariable(Constants.SessionVariableKeys.TREE_QUERY_RESULTS, JSON.stringify(records[0]));
      // and move to the correct form
      if (Number(params.status) === 6) {
        window.location.replace('./mortality_form.html');
      }
      else {
        window.location.replace('./remeasure_form.html');
      }
    }
    else f.addClass('was-validated'); // if form was invalid add class to show feedback
  });

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
  let query_prefix = null;
  let query_prefix_value = null;
  // query for the right plot type
  switch (params.type) {
    case Constants.PlotTypes.REFERENCE_STAND:
      query_prefix = 'stand=? AND ';
      query_prefix_value = params.stand;
      break;
    case Constants.PlotTypes.FIXED_RADIUS_PLOT:
      query_prefix = 'plot=? AND ';
      query_prefix_value = params.plot;
      break;
    default:
      console.log("UNKNOWN PLOT TYPE!!!");
      break;
  }
  // requery when the tag input changes
  let qd = $('input#tag');
  qd.change(() => {
    queryDB('prev_data', query_prefix + 'tag=?', [query_prefix_value, qd.val()]);
  });
});

function queryDB(table, query, params) {
  var failureFn = function (errorMsg) {
    console.log(errorMsg); // puke and die
  }

  var successFn = function (result) {
    // iterate through the results to get the matching record
    records = [];
    for (var row = 0; row < result.getCount(); row++) {
      var r = {};
      r['_id'] = result.getData(row, "_id");
      r['stand'] = result.getData(row, "stand");
      r['plot'] = result.getData(row, "plot");
      r['tag'] = result.getData(row, "tag");
      r['species'] = result.getData(row, "species");
      r['status'] = result.getData(row, "status");
      r['dbh'] = result.getData(row, "dbh");
      r['main_stem'] = result.getData(row, "main_stem");
      r['lean_angle'] = result.getData(row, "lean_angle");
      r['comments'] = result.getData(row, "comments");
      records.push(r);
    }

    // grab the results div and set its value and validity depending on if we found a matching record
    let tag = $('input#tag')[0];
    let res_div = $('#result-tag');
    if (records.length === 0) {
      tag.setCustomValidity('is-invalid');
      res_div.val('');
      res_div.addClass('is-invalid');
    }
    else {
      let r = records[0];
      let st = "[Tag | " + r.tag + '][Status | ' + DataLists.StatusList[r.status] + ']';
      console.log(st);
      res_div.val(st);
      res_div.removeClass('is-invalid');
      tag.setCustomValidity('');
    }
  }

  // query the db
  odkData.query(table, query, params, null, null, '_savepoint_timestamp', 'DESC', 50, 0, null, successFn, failureFn);
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////


function populateSelect(selectElem, OptionsJSON, filter) {
  var selectItems = '';
  $.each(OptionsJSON, (key, value) => {
    let item = '<option value=\'' + key + '\'>' + value + '</option>';
    // console.log(item);
    if (filter === null || filter === undefined || filter(key, value)) selectItems += item;
  });
  if (selectElem) selectElem.append(selectItems);
  return selectItems;
}
