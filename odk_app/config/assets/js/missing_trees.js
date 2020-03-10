$(function () {
  let params = JSON.parse(odkCommon.getSessionVariable(Constants.SessionVariableKeys.SELECTION_PARAMS));
  console.log(params);
  if (params) {
    $('#stand').val(params.stand);
    $('#plot').val(params.plot);
  }

  ///////////////////////////////////////////////////////////////////////////
  let success = function(result) {
    console.log(result);
    for (var row = 0; row < result.getCount(); row++) {
      // let _id = result.getData(row, "_id");
      let TreeID = result.getData(row, "TreeID");
      let stand = result.getData(row, "StandID");
      let plot = result.getData(row, "Plot");
      let tag = result.getData(row, "Tag");
      let species = result.getData(row, "species");
      let status = result.getData(row, "status");
      
      let item = $(`
      <div class="card">
        <div class="card-body">
          <h5>` + tag + ` | <span class="badge badge-primary">` + stand + `</span> <span class="badge badge-success">` + plot + `</span> <span class="badge badge-info">` + TreeID + `</span></h5>
          <i>` + DataLists.SpeciesList[species] + `</i> - ` + DataLists.StatusList[status] + `
        </div>
      </div>
      `);

      $('.tree-list').append(item);
    }
  }

  // this queries on a join table between prev_data and remeasure where
  // the stand, plot, and tag values match between the two tables
  // and the stand and plot values match what the user entered on the landing page
  // and the tag value of the remeasure table is null 

  // this all serves to find all prev_data records for the chosen [stand, plot] for which there
  // is no corresponding record in remeasure with matching stand, plot, tag values
  odkData.arbitraryQuery('prev_data', 
                         `SELECT * 
                            FROM prev_data
                            LEFT OUTER JOIN remeasure 
                              ON prev_data.StandID=remeasure.stand
                             AND prev_data.plot=remeasure.plot
                             AND prev_data.tag=remeasure.tag
                           WHERE prev_data.StandID=? AND prev_data.plot=? AND remeasure.tag IS NULL`
                      , [params.stand, params.plot], null, null, success, console.log);
});
