// Need to set required fields
function bindRemeasureValidate(){

  setDefaults_remeasure()

  setRequired_remeasure()

  dbhCheck_remeasure() // still need database look up
  $('input#dbh_r').change(() => { dbhCheck_remeasure(); });

  leanAngleCheck_remeasure()
  $('input#lean_angle_r').change(() => {leanAngleCheck_remeasure()})

  // if main stem is set to 2 clear crown and tree pct defaults
  clearCrownAndTreePct_remeasure()
  $('select#main_stem_r').change(() => { crownPercentageCheck_remeasure(); });

  crownPercentageCheck_remeasure()
  $('input#crown_percentage_r').change(() => { crownPercentageCheck_remeasure(); });
  $('select#main_stem_r').change(() => { crownPercentageCheck_remeasure(); });

  treePercentageCheck_remeasure()
  $('input#tree_percentage_r').change(() => { treePercentageCheck_remeasure(); });
  $('input#crown_percentage_r').change(() => { treePercentageCheck_remeasure(); });

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


function setRequired_remeasure(){
      $('input#lean_angle_r').prop('required',true)
      $('input#crown_percentage_r').prop('required',true)
      $('input#tree_percentage_r').prop('required',true)
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


function leanAngleCheck_remeasure(){

  let leanAngl = $("input#lean_angle_r")


  leanAngl.change(() => {
    let leanAnglVal = Number(leanAngl.val())
    //console.log(leanAnglVal)

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
    if(mainStemVal === 2)
      $('input#crown_percentage_r').val(" ")
      $('input#tree_percentage_r').val(" ")
  })

}

function crownPercentageCheck_remeasure(){
  let crownPct = $('input#crown_percentage_r')
  // let crownPctVal = Number(crownPct.val())
  // let mainStemVal = Number($('select#main_stem_r').val())
  //
  // if(mainStemVal === 2 && crownPctVal === 100){
  //   setValidityMsg(crownPct, 'If main stem is 2 then crown % must be < 100%')
  // }

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
  // let tree = $('input#tree_percentage_i')
  // let treeVal = Number(tree.val())
  let treePct = $('input#tree_percentage_r')
  // let crownPctVal = Number($('input#crown_percentage_r').val())
  // let mainStemVal = Number($('select#main_stem_r').val())

  // if(treeVal < crownVal){
  //   setValidityMsg(tree, 'Tree % cannot be less then crown %.')
  // } else if(treeVal == 100 && mainStemVal == 2){
  //   setValidityMsg(tree, 'Tree % cannot be less than 100% if Main_Stem=2 (broken)')
  // } else if(treeVal == 100 && mainStemVal == 1){
  //   setValidityMsg(tree, 'If tree % < 100 then Main_Stem must be 2 or 3 (broken)')
  // }

  treePct.change(() =>{
    let treePctVal = Number(treePct.val())
    let crownPctVal = Number($('input#crown_percentage_r').val())
    let mainStemVal = Number($('select#main_stem_r').val())

      if(treePctVal < crownPctVal){
       $('#tree_pct_check_op1_r').modal('show')

       $( "#ok_tree_pct_op1_r" ).click(function() {
         $('#tree_percentage_r').val(" ") // clear value
         $('#tree_pct_check_op1_r').modal('hide')
       })

      } else if(treePctVal === 100 && mainStemVal === 2){
        $('#tree_pct_check_op2_r').modal('show')

        $( "#ok_tree_pct_op2_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op2_r').modal('hide')
        })

      } else if(treePctVal < 100 && mainStemVal === 1){
        $('#tree_pct_check_op3_r').modal('show')

        $( "#ok_tree_pct_op3_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op3_r').modal('hide')
        })

      } else if(treePctVal < 0 || treePctVal > 100){
        $('#tree_pct_check_op4_r').modal('show')

        $( "#ok_tree_pct_op4_r" ).click(function() {
          $('#tree_percentage_r').val(" ") // clear value
          $('#tree_pct_check_op4_r').modal('hide')
        })
    }
  })


}

function fromCheck_remeasure(){

}

function distanceCheck_remeasure(){

  let distance = $('input#distance_r')

  distance.change(()=>{
    let distanceVal = Number(distance.val())

    if(distanceVal < 0.1 || distanceVal > 25.0){
      $('#distance_check_op1_r').modal('show')

      $( "#ok_distance_check_op1_r" ).click(function() {
        $('#distance_r').val(" ") // clear value
        $('#distance_check_op1_r').modal('hide')
      })
    } else if (distanceVal > 10)
    $('#distance_check_op2_r').modal('show')

    $( "#ok_distance_check_op2_r" ).click(function() {
      // $('#distance_r').val(" ") // clear value
      $('#distance_check_op2_r').modal('hide')
    })
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
