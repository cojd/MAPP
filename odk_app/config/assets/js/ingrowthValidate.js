//NOTE: possibly add range constraints in here as well
//      in order to keep consistency and allow for
//      a simpler/(more inuitive) modification eperience for future users

// ALSO: CREATE Classes/Objects for functions in each validation file

//need to set required fields
function bindIngrowthValidate(){

 speciesCheck() // can't be null (REQUIRE) need message

 statusDefault()

 statusSetUp_ingrowth() // need work
 $('input#status_i').change(() => { statusSetUp_ingrowth(); });

 dbhCheck_ingrowth() // need more work
 $('input#dbh_i').change(() => { dbhCheck_ingrowth(); });



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

function statusDefault(){
  $('select#status_i option[value="2"]').attr("selected",true);

  $('select#overall_vigor_i option[value="1"]').attr("selected",true)
  $('select#main_stem_i option[value="1"]').attr("selected",true)
  $('select#rooting_i option[value="1"]').attr("selected",true)
  $('select#lean_angle_i option[value="0"]').attr("selected",true)
  $('input#lean_angle_i').val(0)
  $('input#crown_percentage_i').val(100)
  $('input#tree_percentage_i').val(100)

}



function statusSetUp_ingrowth(){

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
    if(dbhVal < 5){
      alert("Is this correct?")
    }
  })

    // I don't think this needs to be here
    //check if greater by 10 cm since previous
    // if(dbhVal > (previousDbh + 10){
    //   alert("Is this correct?")
    // }



}

function crownPercentageCheck_ingrowth(){
  let crownPct = $('input#crown_percentage_i')
  let crownPctVal = Number(crownPct.val())
  let mainStemVal = Number($('select#main_stem_i').val())

  if(mainStemVal === 2 && crownPctVal === 100){
    setValidityMsg(crownPct, 'If main stem is 2 then crown % must be < 100%')
  }
}

function treePercentageCheck_ingrowth(){

  let tree = $('input#tree_percentage_i')
  let treeVal = Number(tree.val())
  let crownVal = Number($('input#crown_percentage_i').val())

  if(treeVal < crownVal){
    setValidityMsg(tree, 'Tree % cannot be less then crown %.')
  }

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
