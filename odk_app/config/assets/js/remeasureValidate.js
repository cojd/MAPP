
function bindRemeasureValidate(){

  // get current params, using params.status for setting required fields
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));

  if (params.status != 9){
    setDefaults_remeasure()
  }

  setRequired_remeasure(params)

  dbhCheck_remeasure() // still need database look up

  mainStemCheck_remeasure()

  rootingCheck_remeasure()

  leanAngleCheck_remeasure()

  // if main stem is set to 2 clear crown and tree pct defaults
  clearCrownAndTreePct_remeasure()

  crownPercentageCheck_remeasure()

  treePercentageCheck_remeasure()

  // mapping
  fromCheck_remeasure() // need to do database look up

  distanceCheck_remeasure()

  azimuthCheck_remeasure()

}

function setDefaults_remeasure(){
        $('select#overall_vigor_r option[value="1"]').attr("selected",true)
        $('select#main_stem_r option[value="1"]').attr("selected",true)
        $('select#rooting_r option[value="1"]').attr("selected",true)
        $('input#lean_angle_r').val(0)
        $('input#crown_percentage_r').val(100)
        $('input#tree_percentage_r').val(100)
}


function setRequired_remeasure(params){

  // 9 represents 'Not Found'
  if(params.status != 9){
      $('input#dbh_r').prop('required',true)
      $('select#overall_vigor_r').prop('required', true)
      $('select#main_stem_r').prop('required', true)
      $('select#rooting_r').prop('required',true)
      $('input#lean_angle_r').prop('required',true)
      $('input#crown_percentage_r').prop('required',true)
      $('input#tree_percentage_r').prop('required',true)
    } else { 
      $('input#dbh_r').prop('disabled', true)
      $('select#overall_vigor_r').prop('disabled', true)
      $('select#main_stem_r').prop('disabled', true)
      $('select#rooting_r').prop('disabled', true)
      $('input#lean_angle_r').prop('disabled', true)
      $('input#crown_percentage_r').prop('disabled', true)
      $('input#tree_percentage_r').prop('disabled', true)
    }
}


function dbhCheck_remeasure(){

    let dbh = $('input#dbh_r')

    //getting previous value from database
    prevDbhVal = 'NULL'
    let prevData = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS));
    $.each(prevData, (key,value) =>{
      if(key == 'dbh')
        prevDbhVal = value
    })

    dbh.change(()=>{
      let dbhVal = Number(dbh.val())
      console.log(dbhVal) // for testing
      //check if less than previous
      if(dbhVal < prevDbhVal){
        $('#dbh_check_op1_r').modal('show')
        $( "#yes_dbh_op1_r" ).click(function() {
          $('#dbh_check_op1_r').modal('hide')
        })
        $( "#no_dbh_op1_r" ).click(function() {
          $('#dbh_r').val(" ")
          $('#dbh_check_op1_r').modal('hide')
        })
      }

      //check if greater by 5 cm since previous
      if(dbhVal > (prevDbhVal + 5)){
        $('#dbh_check_op2_r').modal('show')
        $( "#yes_dbh_op2_r" ).click(function() {
          $('#dbh_check_op2_r').modal('hide')
        })
        $( "#no_dbh_op2_r" ).click(function() {
          $('#dbh_r').val(" ")
          $('#dbh_check_op2_r').modal('hide')
        })
      }
    })

}

function mainStemCheck_remeasure(){
  let mainStem = $('select#main_stem_r')

  mainStem.change(() =>{
    let mainStemVal = Number(mainStem.val())

    if(mainStemVal === 3){
      $('#main_stem_check_r').modal('show')

      $('#ok_main_stem_r').click(function() {
         $('#main_stem_check_r').modal('hide')
      })
    }
  })
}

function rootingCheck_remeasure(){
  let rooting = $("select#rooting_r")

  rooting.change(() => {

    let rootingVal = Number(rooting.val())

    if(rootingVal === 3){
      $('#rooting_check_r').modal('show')

      $('#ok_rooting_r').click(function() {
         $('#rooting_check_r').modal('hide')
      })
    }
  })
}

function leanAngleCheck_remeasure(){
  let leanAngl = $("input#lean_angle_r")

  leanAngl.change(() => {
    let leanAnglVal = Number(leanAngl.val())

    if(leanAnglVal < 0 || leanAnglVal > 120){
      $('#lean_angl_check_r').modal('show')

      $( "#ok_lean_angl_r" ).click(function() {
        $('#lean_angle_r').val(" ") // clear value
        $('#lean_angl_check_r').modal('hide')
      })
    }
  })

}

function clearCrownAndTreePct_remeasure(){

  let mainStem = $('select#main_stem_r')

  mainStem.change(() => {
    let mainStemVal = Number(mainStem.val())
    if(mainStemVal === 2){
      $('input#crown_percentage_r').val(" ")
      $('input#tree_percentage_r').val(" ")
    } else {
      $('input#crown_percentage_r').val(100)
      $('input#tree_percentage_r').val(100)
    }
  })

}

function crownPercentageCheck_remeasure(){
  let crownPct = $('input#crown_percentage_r')

  crownPct.change(() => {
    let crownPctVal = Number(crownPct.val())
    let mainStemVal = Number($('select#main_stem_r').val())

    if(mainStemVal === 2 && crownPctVal === 100){
      $('#crwn_pct_check_op1_r').modal('show')

      $( "#ok_crwn_pct_op1_r" ).click(function() {
        $('#crown_percentage_r').val(" ") // clear value
        $('#crwn_pct_check_op1_r').modal('hide')
      })
    } else if(crownPctVal < 0 || crownPctVal > 100){
      $('#crwn_pct_check_op2_r').modal('show')

      $( "#ok_crwn_pct_op2_r" ).click(function() {
        $('#crown_percentage_r').val(" ") // clear value
        $('#crwn_pct_check_op2_r').modal('hide')
      })
    }
  })
}

function treePercentageCheck_remeasure(){

  let treePct = $('input#tree_percentage_r')

  treePct.change(() =>{
    let treePctVal = Number(treePct.val())
    let crownPctVal = Number($('input#crown_percentage_r').val())
    let mainStemVal = Number($('select#main_stem_r').val())

      if(treePctVal <= crownPctVal && mainStemVal == 2){
        $('#tree_pct_check_op1_r').modal('show')

        $( "#ok_tree_pct_op1_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op1_r').modal('hide')
        })

      } else if(treePctVal < crownPctVal){
       $('#tree_pct_check_op2_r').modal('show')

       $( "#ok_tree_pct_op2_r" ).click(function() {
         $('#tree_percentage_r').val(" ") // clear value
         $('#tree_pct_check_op2_r').modal('hide')
       })

      } else if(treePctVal === 100 && mainStemVal === 2){
        $('#tree_pct_check_op3_r').modal('show')

        $( "#ok_tree_pct_op3_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op3_r').modal('hide')
        })

      } else if(treePctVal < 100 && mainStemVal === 1){
        $('#tree_pct_check_op4_r').modal('show')

        $( "#ok_tree_pct_op4_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op4_r').modal('hide')
        })

      } else if(treePctVal < 0 || treePctVal > 100){
        $('#tree_pct_check_op5_r').modal('show')

        $( "#ok_tree_pct_op5_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op5_r').modal('hide')
        })
      }
  })


}

function fromCheck_remeasure(){
  // 0 only allowed in fixed radius plots
  let fromTag = $('input#from_tag_r')

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
      console.log("fromCheck_remeasure(): database look up failed")
      alert("fromCheck_remeasure(): database look up failed")
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
        break;
     default:
        break;
    }

    odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)

  })

  function search_newTrees(params){

    let success = function(result){
      if(result.getCount() === 0){
        $('#from_check_r').modal('show')

        $( "#ok_from_check_r" ).click(function() {
          $('#from_tag_r').val(" ") // clear value
          $('#from_check_r').modal('hide')
        })

      } else{
        // alert("Tree Found in search_newTrees")
        console.log("succes")
      }
    }

    let failure = function(result){
      console.log("fromCheck_remeasure(): database look up failed")
      alert("fromCheck_remeasure(): database look up failed (search_newTrees)")
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
       break;
     default:
      break;
   }

   odkData.arbitraryQuery('prev_data',query, bindParams, null, null, success, failure)
  }
}

function distanceCheck_remeasure(){


  let distance = $('input#distance_r')

  distance.change(()=>{
    let distanceVal = Number(distance.val())
    console.log("distanceVal " + distanceVal)

    if(distanceVal < 0.1 || distanceVal > 25.0){
      $('#distance_check_op1_r').modal('show')

      $( "#ok_distance_check_op1_r" ).click(function() {
        $('#distance_r').val(" ") // clear value
        $('#distance_check_op1_r').modal('hide')
      })
    } else if (distanceVal > 18){
    $('#distance_check_op2_r').modal('show')

    $( "#ok_distance_check_op2_r" ).click(function() {
      // $('#distance_r').val(" ") // clear value
      $('#distance_check_op2_r').modal('hide')
    })
    }
  })
}

function azimuthCheck_remeasure(){

  let azimuth = $('input#azimuth_r')


  azimuth.change(()=>{
      let azimuthVal = Number(azimuth.val())

      if(azimuthVal < 0 || azimuthVal > 360){
        $('#azimuth_check_r').modal('show')

        $( "#ok_azimuth_check_r" ).click(function() {
          $('#azimuth_r').val(" ") // clear value
          $('#azimuth_check_r').modal('hide')
        })
      }
  })
}
