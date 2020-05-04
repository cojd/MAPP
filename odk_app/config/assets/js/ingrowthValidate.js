//NOTE: possibly add range constraints in here as well
//      in order to keep consistency and allow for
//      a simpler/(more inuitive) modification experience for future users

// ALSO: CREATE Classes/Objects for functions in each validation file

//need to set required fields
function bindIngrowthValidate(){

 speciesCheck() // can't be null (REQUIRE) need message

 // set defaults when page is loaded
 statusDefault_ingrowth()

 //setRequired_ingrowth()

 // changes defaults if status is changed
 statusOnChangeDefaults_ingrowth() // need work

 dbhCheck_ingrowth() // need more work
 $('input#dbh_i').change(() => { dbhCheck_ingrowth(); });

 crownRatioCheck_ingrowth()

 leanAngleCheck_ingrowth()

 crownPercentageCheck_ingrowth()
 $('input#crown_percentage_i').change(() => { crownPercentageCheck_ingrowth(); });
 $('select#main_stem_i').change(() => { crownPercentageCheck_ingrowth(); });

// treePercentageDefault()

 treePercentageCheck_ingrowth()
 $('input#tree_percentage_i').change(() => { treePercentageCheck_ingrowth(); });
 $('input#crown_percentage_i').change(() => { treePercentageCheck_ingrowth(); });

 // mapping
 fromCheck_ingrowth() // need to do database look up

 distanceCheck_ingrowth()
 //$('input#distance').change(() => { distanceCheck(); });

}

// require sepcies
function speciesCheck(){
  //let species = $('select#species')
  // species.prop('required',true)
  // species.change(()=>{
  //   console.log(species.val())
  // })
  $('#species_i').prop('require',true)

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

  // $('select#species_i').prop('require',true)
  $('input#dbh_i').prop('required',true)

  // $('select#status_i').prop('required',true)

  $('input#crown_ratio_i').prop('required',true)

  $('select#overall_vigor_i').prop('require',true)
  $('select#main_stem_i').prop('require',true)
  $('select#rooting_i').prop('require',true)
  $('input#lean_angle_i').prop('require',true)
  $('input#crown_percentage_i').prop('require',true)
  $('input#tree_percentage_i').prop('require',true)

}

function statusOnChangeDefaults_ingrowth(){

  let treeStatus = $('select#status_i')

  treeStatus.change(()=>{

    console.log(treeStatus.val())

    let treeStatusVal = Number(treeStatus.val())
    console.log(treeStatusVal)



    if(treeStatusVal == 2){
      //(alert("Option1 Selected"))
      // still need to make fields required
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
      $('input#lean_angle_i').val("")
      $('input#crown_percentage_i').val("")
      $('input#tree_percentage_i').val("")
    }
  })
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



function crownPercentageCheck_ingrowth(){
  let crownPct = $('input#crown_percentage_i')
  // let crownPctVal = Number(crownPct.val())
  // let mainStemVal = Number($('select#main_stem_i').val())

  // if(mainStemVal === 2 && crownPctVal === 100){
  //   setValidityMsg(crownPct, 'If main stem is 2 then crown % must be < 100%')
  // }

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
  // let tree = $('input#tree_percentage_i')
  // let treeVal = Number(tree.val())
  // let crownVal = Number($('input#crown_percentage_i').val())
  //
  // if(treeVal < crownVal){
  //   setValidityMsg(tree, 'Tree % cannot be less then crown %.')
  // }

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


}

function distanceCheck_ingrowth(){

  let distance = $('input#distance_i')

  distance.change(()=>{
    let distanceVal = Number(distance.val())
    if(distanceVal > 10){
      alert("Is there a closer mapped tree?")
    }
  })
}
