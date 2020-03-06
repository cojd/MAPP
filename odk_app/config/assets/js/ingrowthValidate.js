//NOTE: possibly add range constraints in here as well
//      in order to keep consistency and allow for
//      a simpler/(more inuitive) modification eperience for future users

function bindIngrowthValidate(){



  let s = $('select#rooting');
 s.change(()=>{
   console.log(s.val())
 })

 speciesCheck() // not working

 statusSetUp() // need work

 dbhCheck() // need more work

 overallVigorDefault()

 mainStemDefault()

 rootingDefault()

 leanAngleDefault()

 crownPercentageDefault()

 crownPercentageCheck()
 $('input#crown_percentage').change(() => { crownPercentageCheck(); });
 $('select#main_stem').change(() => { crownPercentageCheck(); });

 treePercentageDefault()

 treePercentageCheck()
 $('input#tree_percentage').change(() => { treePercentageCheck(); });
 $('input#crown_percentage').change(() => { treePercentageCheck(); });

 // mapping
 fromCheck() // need to do database look up

 distanceCheck()
 //$('input#distance').change(() => { distanceCheck(); });

}

// require sepcies
function speciesCheck(){
  //let species = $('select#species')
  // species.prop('required',true)
  // species.change(()=>{
  //   console.log(species.val())
  // })
  $('#species').prop('require',true)

}

function statusSetUp(){

}

function dbhCheck(){

  let dbh = $('input#dbh')

  dbh.change(()=>{

    let dbhVal = Number(dbh.val())
    console.log(dbhVal) // for testing
    if(dbhVal < 5){
      alert("Is this correct?")
    }
    //check if greater by 10 cm since previous
    // if(dbhVal > (previousDbh + 10){
    //   alert("Is this correct?")
    // }

  })

}

function overallVigorDefault(){
  // the default value is specified inside of option[value="changeMe"]
  $('select#overall_vigor option[value="1"]').attr("selected",true);
}

function mainStemDefault(){
  // the default value is specified inside of option[value="changeMe"]
  $('select#main_stem option[value="1"]').attr("selected",true);
}

function rootingDefault(){
  // the default value is specified inside of option[value="changeMe"]
  $('select#rooting option[value="1"]').attr("selected",true);
}

function leanAngleDefault(){
  //the default value is specified inside of val(changeMe)
  $('input#lean_angle').val(0)
}

function crownPercentageDefault(){
  $('input#crown_percentage').val(100)
}

function crownPercentageCheck(){
  let crownPct = $('input#crown_percentage')
  let crownPctVal = Number(crownPct.val())
  let mainStemVal = Number($('select#main_stem').val())

  if(mainStemVal === 2 && crownPctVal === 100){
    setValidityMsg(crownPct, 'If main stem is 2 then crown % must be < 100%')
  }
}

function treePercentageDefault(){
  //the default value is specified inside of val(changeMe)
  $('input#tree_percentage').val(100)
}

function treePercentageCheck(){

  let tree = $('input#tree_percentage')
  let treeVal = Number(tree.val())
  let crownVal = Number($('input#crown_percentage').val())

  if(treeVal < crownVal){
    setValidityMsg(tree, 'Tree % cannot be less then crown %.')
  }

}

function fromCheck(){

}

function distanceCheck(){

  let distance = $('input#distance')

  distance.change(()=>{
    let distanceVal = Number(distance.val())
    if(distanceVal > 10){
      alert("Is there a closer mapped tree?")
    }
  })
}
