//NOTE: possibly add range constraints in here as well
//      in order to keep consistency and allow for
//      a simpler/(more inuitive) modification experience for future users

// ALSO: CREATE Classes/Objects for functions in each validation file

function bindIngrowthValidate(){

 // set defaults when page is loaded
 statusDefault_ingrowth()

 setRequired_ingrowth()

 // changes defaults if status is changed
 statusOnChangeDefaults_ingrowth()

tagCheck_ingrowth()

 dbhCheck_ingrowth()

 crownRatioCheck_ingrowth()

 leanAngleCheck_ingrowth()

 // if main stem is set to 2 clear crown pct default
 clearCrownPct_ingrowth()

 crownPercentageCheck_ingrowth()

 treePercentageCheck_ingrowth()

 // mapping
 fromCheck_ingrowth() // need to do database look up

 distanceCheck_ingrowth()

 azimuthCheck_ingrowth()

}


function statusDefault_ingrowth(){

  $('select#status_i option[value="2"]').attr("selected",true);
  $('select#overall_vigor_i option[value="1"]').attr("selected",true)
  $('select#main_stem_i option[value="1"]').attr("selected",true)
  $('select#rooting_i option[value="1"]').attr("selected",true)
  $('input#lean_angle_i').val(0)
  $('input#crown_percentage_i').val(100)
  $('input#tree_percentage_i').val(100)

}

function setRequired_ingrowth(){

  $('input#dbh_r').prop('required',true)
  $('select#overall_vigor_i').prop('required',true)
  $('select#main_stem_i').prop('required',true)
  $('select#rooting_i').prop('required',true)
  $('input#lean_angle_i').prop('required',true)
  $('input#crown_percentage_i').prop('required',true)
  $('input#tree_percentage_i').prop('required',true)
  $('input#canopy_class_i').prop('required',true) // not working for some reason
  $('input#crown_ratio_i').prop('required',true)

}

function statusOnChangeDefaults_ingrowth(){

  let treeStatus = $('select#status_i')

  treeStatus.change(()=>{

    let treeStatusVal = Number(treeStatus.val())

    if(treeStatusVal == 2){
      $('select#overall_vigor_i option[value="1"]').attr("selected",true)
      $('select#main_stem_i option[value="1"]').attr("selected",true)
      $('select#rooting_i option[value="1"]').attr("selected",true)
      $('input#lean_angle_i').val(0)
      $('input#crown_percentage_i').val(100)
      $('input#tree_percentage_i').val(100)

    } else{
      $('select#overall_vigor_i option[value="1"]').attr("selected",false)
      $('select#main_stem_i option[value="1"]').attr("selected",false)
      $('select#rooting_i option[value="1"]').attr("selected",false)
      $('input#lean_angle_i').val(" ")
      $('input#crown_percentage_i').val(" ")
      $('input#tree_percentage_i').val(" ")
    }
  })
}


function tagCheck_ingrowth(){
  let tag = $('input#tag')

  tag.change(()=>{
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));

    let success = function(result) {
      if(result.getCount() > 0){ // usually 1, but can be more sometimes in special cases
        $('#tag_check_i').modal('show')

        $( "#ok_tag_i" ).click(function() {
          $('tag').val(" ") // clear value
          $('#tag_check_i').modal('hide')
        })

      } else if (result.getCount() === 0){
        search_newTrees(params)
        // console.log("tree not found")
      } else {
        console.log("error")
      }
    }

    let failure = function(result){
      console.log("tagCheck_ingrowth(): database look up failed")
      alert("tagCheck_ingrowth(): database look up failed")
    }

    let query = `SELECT * FROM prev_data
                          WHERE prev_data.StandID=?
                            AND prev_data.tag=?`;

    let bindParams = [params.stand, tag.val()]

    switch(params.type)
    {
      case Constants.PlotTypes.FIXED_RADIUS_PLOT:
        query += ` AND prev_data.plot=?`
        bindParams.push(params.plot)
     default:
        break;
    }

    odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)

  })

  function search_newTrees(params){

    let success = function(result){
      if(result.getCount() > 0){ // or !==
        $('#tag_check_i').modal('show')

        $( "#ok_tag_i" ).click(function() {
          $('tag').val(" ") // clear value
          $('#tag_check_i').modal('hide')
        })

      } else if (result.getCount() === 0){
        console.log("tree not found")
        // success, we can continue
      } else {
        console.log("error")
      }
    }

    let failure = function(result){
      console.log("fromCheck_ingrowth(): database look up failed")
      alert("fromCheck_ingrowth(): database look up failed (search_newTrees)")
    }

    let query = `SELECT * FROM measure
                          WHERE measure.stand=?
                            AND measure.tag=?`;

   let bindParams = [params.stand, tag.val()]

   switch(params.type)
   {
     case Constants.PlotTypes.FIXED_RADIUS_PLOT:
        // value of 0 zero selected, only allowed for fixed radius plots
       if(Number(fromTag.val()) === 0){
         return;
       }
       query += ` AND measure.plot=?`
       bindParams.push(params.plot)
     default:
      break;
   }

   odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)
  }

}

function dbhCheck_ingrowth(){

  let dbh = $('input#dbh_i')

  dbh.change(()=>{
    let dbhVal = Number(dbh.val())
    console.log(dbhVal) // for testing

    //check if greater than 10 cm
    if(dbhVal < 5){
      $('#dbh_check_op1_i').modal('show')
      $( "#yes_dbh_op1_i" ).click(function() {
        $('#dbh_check_op1_i').modal('hide')
      })
      $( "#no_dbh_op1_i" ).click(function() {
        $('#dbh_i').val(" ")
        $('#dbh_check_op1_i').modal('hide')
      })
    }

    //check if greater than 10 cm
    if(dbhVal > 10){
      $('#dbh_check_op2_i').modal('show')
      $( "#yes_dbh_op2_i" ).click(function() {
        $('#dbh_check_op2_i').modal('hide')
      })
      $( "#no_dbh_op2_i" ).click(function() {
        $('#dbh_i').val(" ")
        $('#dbh_check_op2_i').modal('hide')
      })
    }
  })

}

function crownRatioCheck_ingrowth(){
  let crownRatio = $('input#crown_ratio_i')

  crownRatio.change(()=>{
    crownRatioVal = Number(crownRatio.val())

    if(crownRatioVal < 1 || crownRatioVal > 100){
      $('#crown_ratio_check_i').modal('show')

      $('#ok_crown_ratio_i').click(function() {
        $('input#crown_ratio_i').val(" ")
        $('#crown_ratio_check_i').modal('hide')
      })
    }
  })
}

function leanAngleCheck_ingrowth(){
  let leanAngl = $("input#lean_angle_i")

  leanAngl.change(() => {
    let leanAnglVal = Number(leanAngl.val())

    if(leanAnglVal < 0 || leanAnglVal > 120){
      $('#lean_angl_check_i').modal('show')

      $( "#ok_lean_angl_i" ).click(function() {
        $('#lean_angle_i').val(" ") // clear value
        $('#lean_angl_check_i').modal('hide')
      })
    }
  })
}

function clearCrownPct_ingrowth(){
  let mainStem = $('select#main_stem_i')

  mainStem.change(() => {
    let mainStemVal = Number(mainStem.val())
    if(mainStemVal === 2){
      $('input#crown_percentage_i').val(" ")
    } else {
      $('input#crown_percentage_i').val(100)
    }
  })
}

function crownPercentageCheck_ingrowth(){
  let crownPct = $('input#crown_percentage_i')

  crownPct.change(() => {
    let crownPctVal = Number(crownPct.val())
    let mainStemVal = Number($('select#main_stem_i').val())

    if(mainStemVal === 2 && crownPctVal === 100){
      $('#crwn_pct_check_op1_i').modal('show')

      $( "#ok_crwn_pct_op1_i" ).click(function() {
        $('#crown_percentage_i').val(" ") // clear value
        $('#crwn_pct_check_op1_i').modal('hide')
      })
    } else if(crownPctVal < 0 || crownPctVal > 100){
      $('#crwn_pct_check_op2_i').modal('show')

      $( "#ok_crwn_pct_op2_i" ).click(function() {
        $('#crown_percentage_i').val(" ") // clear value
        $('#crwn_pct_check_op2_i').modal('hide')
      })
    }
  })
}

function treePercentageCheck_ingrowth(){

  let treePct = $('input#tree_percentage_i')

  treePct.change(() => {
    let treePctVal = Number(treePct.val())
    let crownPctVal = Number($('input#crown_percentage_i').val())

    if(treePctVal < crownPctVal){
      $('#tree_pct_check_op1_i').modal('show')

      $( "#ok_tree_pct_op1_i" ).click(function() {
        $('#tree_percentage_i').val(" ") // clear value
        $('#tree_pct_check_op1_i').modal('hide')
      })
    } else if(treePctVal < 0 || treePctVal > 100){
      $('#tree_pct_check_op2_i').modal('show')

      $( "#ok_tree_pct_op2_i" ).click(function() {
        $('#tree_percentage_i').val(" ") // clear value
        $('#tree_pct_check_op2_i').modal('hide')
      })
    }
  })
}

function fromCheck_ingrowth(){
  // 0 only allowed in fixed radius plots
  let fromTag = $('input#from_tag_i')

  fromTag.change(()=>{

    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));

    let success = function(result) {
      if(result.getCount() === 0){
        // alert("Tree Not Found")
        search_newTrees(params)
      } else {
        // alert("Tree Found")
        console.log("Tree Found")
      }
    }

    let failure = function(result){
      console.log("fromCheck_ingrowth(): database look up failed")
      alert("fromCheck_ingrowth(): database look up failed")
    }

    let query = `SELECT * FROM prev_data
                          WHERE prev_data.StandID=?
                            AND prev_data.tag=?`;

    let bindParams = [params.stand, fromTag.val()]

    switch(params.type)
    {
      case Constants.PlotTypes.FIXED_RADIUS_PLOT:
        // alert("accesed fixed radius plot")
        if(Number(fromTag.val()) === 0){
          // alert("fixed r plot from tag selected is 0")
          return;
        }
        query += ` AND prev_data.plot=?`
        bindParams.push(params.plot)
     default:
        break;
    }

    odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)

  })

  function search_newTrees(params){

    let success = function(result){
      if(result.getCount() === 0){
        $('#from_check_i').modal('show')

        $( "#ok_from_check_i" ).click(function() {
          $('#from_tag_i').val(" ") // clear value
          $('#from_check_i').modal('hide')
        })

      } else{
        // alert("Tree Found in search_newTrees")
        console.log("succes")
      }
    }

    let failure = function(result){
      console.log("fromCheck_ingrowth(): database look up failed")
      alert("fromCheck_ingrowth(): database look up failed (search_newTrees)")
    }

    let query = `SELECT * FROM measure
                          WHERE measure.stand=?
                            AND measure.tag=?`;

   let bindParams = [params.stand, fromTag.val()]

   switch(params.type)
   {
     case Constants.PlotTypes.FIXED_RADIUS_PLOT:
        // value of 0 zero selected, only allowed for fixed radius plots
       if(Number(fromTag.val()) === 0){
         return;
       }
       query += ` AND measure.plot=?`
       bindParams.push(params.plot)
     default:
      break;
   }

   odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)
  }
}

function distanceCheck_ingrowth(){

  let distance = $('input#distance_i')

  distance.change(()=>{
    let distanceVal = Number(distance.val())

    if(distanceVal < 0.1 || distanceVal > 25.0){
      $('#distance_check_op1_i').modal('show')

      $( "#ok_distance_check_op1_i" ).click(function() {
        $('#distance_i').val(" ") // clear value
        $('#distance_check_op1_i').modal('hide')
      })
    } else if (distanceVal > 10){
    $('#distance_check_op2_i').modal('show')

    $( "#ok_distance_check_op2_i" ).click(function() {
      // $('#distance_r').val(" ") // clear value
      $('#distance_check_op2_i').modal('hide')
    })
    }
  })
}

function azimuthCheck_ingrowth(){

  let azimuth = $('input#azimuth_i')

  azimuth.change(()=>{
      let azimuthVal = Number(azimuth.val())

      if(azimuthVal < 0 || azimuthVal > 360){
        $('#azimuth_check_i').modal('show')

        $( "#ok_azimuth_check_i" ).click(function() {
          $('#azimuth_i').val(" ") // clear value
          $('#azimuth_check_i').modal('hide')
        })
      }
  })
}
