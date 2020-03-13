// need to set required and optional fields
function bindMortalityValidtate(){

  mainStemCheck_mortality()
  $('select#main_stem_m').change(() => { mainStemCheck_mortality(); });

  rootingCheck_moratlity()
  $('select#rooting_m').change(() => { rootingCheck_moratlity(); });

  leangAngleCheck_mortality()
  $('select#rooting_m').change(() => { leangAngleCheck_mortality(); });
  $('input#lean_angle_m').change(() => { leangAngleCheck_mortality(); });

  crownPercentageCheck_mortality()
  $('input#crown_percentage_m').change(() => { crownPercentageCheck_mortality(); });
  $('select#main_stem_m').change(() => { crownPercentageCheck_mortality(); });

  treePercentageCheck_mortality()
  $('input#tree_percentage_m').change(() => { treePercentageCheck_mortality(); });
  $('input#crown_percentage_m').change(() => { treePercentageCheck_mortality(); });

  groundPercentageCheck_moratlity()
  $('input#ground_percentage_m').change(() => { treePercentageCheck_mortality(); });

}

function mainStemCheck_mortality(){
  let mainStemVal = Number($('select#main_stem_m').val())

  if(mainStemVal == 1){
    // optional 12 to 13
  } else if(mainStemVal == 2){
    // require 5 to 6
    // option 8 to 10
    // require 12 to 13
  } else if(mainStemVal == 3){
    // require 12 to 13
  }
}

function rootingCheck_moratlity(){
  let rootingVal = Number($('select#rooting_m').val())

  if(rootingVal == 1){
    //require 5 to 10
  } else if(rootingVal == 2){
    // require 5 to 10
  } else if(rootingVal == 3){
    // require 12 to 13
  }
}

function leangAngleCheck_mortality(){
  let leanAngle = $('input#lean_angle_m')
  let leanAngleVal = Number(leanAngle.val())
  let rootingVal = Number($('#select#rooting_m').val())


  leanAngle.change(()=>{
    let leanAngleCheck = Number(leanAngle.val())
    if(leanAngleCheck > 100){
      alert('Lean Angle > 100? Check it Again')
    }
  })

  //Figure this out later
  // if(rootingVal == 3 &&  leanAngleVal == NULL){
  //   setValidityMsg(leanAngleVal, 'Lean Angle, Crown %, Tree % should be blank when Rooting=3 (uprooted)')
  // }

}

function crownPercentageCheck_mortality(){
  let crownPct = $('input#crown_percentage_m')
  let crownPctVal = Number(crownPct.val())
  let mainStemVal = Number($('select#main_stem_m').val())

  if(mainStemVal === 2 && crownPctVal === 100){
    setValidityMsg(crownPct, 'If main stem is 2 then crown % must be < 100%')
  }
}

function treePercentageCheck_mortality(){
  let tree = $('input#tree_percentage_i')
  let treeVal = Number(tree.val())
  let crownVal = Number($('input#crown_percentage_i').val())
  let mainStemVal = Number($('select#main_stem_r').val())

  if(treeVal < crownVal){
    setValidityMsg(tree, 'Tree % cannot be less then crown %.')
  } else if(treeVal == 100 && mainStemVal == 2){
    setValidityMsg(tree, 'Tree % cannot be less than 100% if Main_Stem=2 (broken)')
  } else if(treeVal > 100 && treeVal < 100){
    setValidityMsg(tree, 'If tree % < 100 then Main_Stem must be 2 or 3 (broken)')
  }
}

function groundPercentageCheck_moratlity(){
  let groundPrct = $('input#ground_percentage_m')

  groundPrct.change(()=>{
    let groundPrctVal = Number(groundPrct.val())

    if(groundPrctVal >= 0){
      value = 100 - groundPrctVal
      $('input#support_percentage_m').val(value)
    } else if(groundPrctVal == -1){
      value = -1
      $('input#support_percentage_m').val(value)
    }
  })
}
