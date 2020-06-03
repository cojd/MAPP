$(function () {
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
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
      let species = result.getData(row, "Species");
      let status = result.getData(row, "PrevStatus");
      let dbh = result.getData(row, "PrevDBH");
      
      let item = $('<tr> <th scope="row">' + tag + '</th> <td>' + stand + '</td> <td>' + plot + '</td> <td>' + DataLists.SpeciesList[species] + '</td> <td>' + DataLists.StatusList[status] + '</td> <td>' + dbh + '</td> </tr>');

      $('.tree-list tbody').append(item);
    }
  }

  // this queries on a join table between prev_data, measure and mortality where
  // the stand, plot, and tag values match between the three tables
  // and the stand and plot values match what the user entered on the landing page
  // and the tag value of both the measure and mortality tables are null 

  // this all serves to find all prev_data records for the chosen [stand, plot] for which there
  // is no corresponding record in measure or mortality with matching stand, plot, tag values
  let query = `SELECT * 
                 FROM prev_data
                 LEFT OUTER JOIN measure 
                   ON prev_data.StandID=measure.stand
                  AND prev_data.plot=measure.plot
                  AND prev_data.tag=measure.tag
                 LEFT OUTER JOIN mortality
                   ON prev_data.StandID=mortality.stand
                  AND prev_data.plot=mortality.plot
                  AND prev_data.tag=mortality.tag`;
  let p = [params.stand];

  switch (params.type)
  {
    case Constants.PlotTypes.REFERENCE_STAND:
      query += ' WHERE prev_data.StandID=? AND measure.tag IS NULL AND mortality.tag IS NULL';
      break;
    case Constants.PlotTypes.FIXED_RADIUS_PLOT:
      query += ' WHERE prev_data.StandID=? AND prev_data.plot=? AND measure.tag IS NULL AND mortality.tag IS NULL';
      p.push(params.plot);
      break;
    default:
      console.log('missing_trees.js: THIS REALLY SHOULDN\'T HAPPEN');
      break;
  }
  query += ' AND prev_data.PrevStatus!=6' // dont display dead trees in prev_data as missing

  odkData.arbitraryQuery('prev_data', query, p, null, null, success, console.log);
});
