
function bindMortalityValidtate(){

  setRequired_mortality()

  leanAngleCheck_mortality()

  crownPercentageCheck_mortality()

  treePercentageCheck_mortality()

  groundPercentageCheck_moratlity()

  // should never be accessed, since support percentage is caclculated
  // from ground percentage, made function just in case if edge
  // cases arise
  supportPercentageCheck_mortality()

}

function setRequired_mortality(){
  let mainStem = $('select#main_stem_m')
  let rooting = $('select#rooting_m')

  $('select#main_stem_m').prop('required',true)
  $('select#proximate').prop('required',true)

  mainStem.change(() =>{
    let mainStemVal = Number(mainStem.val())
    let rootingVal = Number(rooting.val())

    // order matters

    if(mainStemVal === 1 && (rootingVal === 1 || rootingVal === 2)){
      // if ms-1 and r-1 || r-2
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',true) // 8
      $('input#crown_percentage_m').prop('required',true) // 9
      $('input#tree_percentage_m').prop('required',true) // 10
      $('input#ground_percentage_m').prop('required', false) //12
      $('input#support_percentage_m').prop('required',false) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', true) //12
      $('input#support_percentage_m').prop('disabled', true) //13

    } else if(mainStemVal === 2 && (rootingVal === 1 || rootingVal === 2)){
      // if ms-2 and r-1 || r-2
      $('select#rooting_m').prop('required',true) //6
      $('input#lean_angle_m').prop('required',true) // 8
      $('input#crown_percentage_m').prop('required',true) // 9
      $('input#tree_percentage_m').prop('required',true) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 3 && (rootingVal === 1 || rootingVal === 2)){
    // if ms-3 and r-1 || r-2
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required',false) // 9
      $('input#tree_percentage_m').prop('required',false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 1 && rootingVal === 3) {
      // if ms-1 and r3
      $('select#rooting_m').prop('required',true) //6  // changed
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 2 && rootingVal === 3){
      // if ms-2 and r3
      $('select#rooting_m').prop('required',true) //6
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', true) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 3 && rootingVal === 3){
      // if ms-3 and r3
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required', false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required', true) //12
      $('input#support_percentage_m').prop('required', true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 1){
      // if ms-1
      $('select#rooting_m').prop('required',true) //6            changed
      $('input#lean_angle_m').prop('required',true) // 8         changed
      $('input#crown_percentage_m').prop('required',true) // 9   changed
      $('input#tree_percentage_m').prop('required',true) // 10   changed
      $('input#ground_percentage_m').prop('required',false) //12
      $('input#support_percentage_m').prop('required',false) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', true) //12
      $('input#support_percentage_m').prop('disabled', true) //13

    } else if(mainStemVal === 2){
      // if ms-2
      $('select#rooting_m').prop('required',true) //6
      $('input#lean_angle_m').prop('required',true) // 8         changed
      $('input#crown_percentage_m').prop('required',true) // 9  changed
      $('input#tree_percentage_m').prop('required',true) // 10  changed
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(mainStemVal === 3){
      // if ms-3
      $('select#rooting_m').prop('required',true) //6 //changed
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    }
  })

  rooting.change(() =>{
    let rootingVal = Number(rooting.val())
    let mainStemVal = Number(mainStem.val())

    if((rootingVal === 1 || rootingVal === 2) && mainStemVal === 1){
      // if r-1 || r-2 and ms-1
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',true) // 8
      $('input#crown_percentage_m').prop('required',true) // 9
      $('input#tree_percentage_m').prop('required',true) // 10
      $('input#ground_percentage_m').prop('required', false) //12
      $('input#support_percentage_m').prop('required',false) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', true) //12
      $('input#support_percentage_m').prop('disabled', true) //13

    } else if(rootingVal === 3  && mainStemVal === 1){
      // if r-3 and ms-1
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if((rootingVal === 1 || rootingVal === 2) && mainStemVal === 2){
      // if r-1 || r-2 and ms-2
      $('select#rooting_m').prop('required',true) //6
      $('input#lean_angle_m').prop('required',true) // 8
      $('input#crown_percentage_m').prop('required',true) // 9
      $('input#tree_percentage_m').prop('required',true) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', false) // 8
      $('input#crown_percentage_m').prop('disabled', false) // 9
      $('input#tree_percentage_m').prop('disabled', false) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(rootingVal === 3 && mainStemVal === 2){
      // if r-3 and ms-2
      $('select#rooting_m').prop('required',true) //6
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) // 12
      $('input#support_percentage_m').prop('disabled', false) // 13

    } else if((rootingVal === 1 || rootingVal === 2) && mainStemVal === 3){
      // if r-1 || r-2 and ms-3
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',false) // 8          changed
      $('input#crown_percentage_m').prop('required',false) // 9    changed
      $('input#tree_percentage_m').prop('required',false) // 10    chagned
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    } else if(rootingVal === 3 && mainStemVal === 3){
      // if r-3 and ms-3
      $('select#rooting_m').prop('required',false) //6
      $('input#lean_angle_m').prop('required',false) // 8
      $('input#crown_percentage_m').prop('required', false) // 9
      $('input#tree_percentage_m').prop('required', false) // 10
      $('input#ground_percentage_m').prop('required',true) //12
      $('input#support_percentage_m').prop('required',true) //13

      // false = "field enabled", true = "field disabled (nulled out)"
      $('input#lean_angle_m').prop('disabled', true) // 8
      $('input#crown_percentage_m').prop('disabled', true) // 9
      $('input#tree_percentage_m').prop('disabled', true) // 10
      $('input#ground_percentage_m').prop('disabled', false) //12
      $('input#support_percentage_m').prop('disabled', false) //13

    }
  })
}


function leanAngleCheck_mortality(){
  let leanAngle = $('input#lean_angle_m')

  leanAngle.change(()=>{
    let leanAngleVal = Number(leanAngle.val())

    if(leanAngleVal < 0 || leanAngleVal > 120){
      $('#lean_angl_check_op1_m').modal('show')

      $( "#ok_lean_angl_op1_m" ).click(function() {
        $('#lean_angle_m').val(" ") // clear value
        $('#lean_angl_check_op1_m').modal('hide')
      })
    } else if(leanAngleVal > 100){
      $('#lean_angl_check_op2_m').modal('show')

      $( "#ok_lean_angl_op2_m" ).click(function() {
        // $('#lean_angle_m').val(" ") // clear value
        $('#lean_angl_check_op2_m').modal('hide')
      })
    }
  })

}

function crownPercentageCheck_mortality(){
  let crownPct = $('input#crown_percentage_m')

  crownPct.change(() => {
    let crownPctVal = Number(crownPct.val())
    let mainStemVal = Number($('select#main_stem_m').val())

    if(mainStemVal === 2 && crownPctVal === 100){
      $('#crwn_pct_check_op1_m').modal('show')

      $( "#ok_crwn_pct_op1_m" ).click(function() {
        $('#crown_percentage_m').val(" ") // clear value
        $('#crwn_pct_check_op1_m').modal('hide')
      })
    } else if(crownPctVal < 0 || crownPctVal > 100){
      $('#crwn_pct_check_op2_m').modal('show')

      $( "#ok_crwn_pct_op2_m" ).click(function() {
        $('#crown_percentage_m').val(" ") // clear value
        $('#crwn_pct_check_op2_m').modal('hide')
      })
    }
  })
}

function treePercentageCheck_mortality(){
  let treePct = $('input#tree_percentage_m')

  treePct.change(() =>{
    let treePctVal = Number(treePct.val())
    let crownPctVal = Number($('input#crown_percentage_m').val())
    let mainStemVal = Number($('select#main_stem_m').val())

      if(treePctVal < crownPctVal){
       $('#tree_pct_check_op1_m').modal('show')

       $( "#ok_tree_pct_op1_m" ).click(function() {
         $('#tree_percentage_m').val(" ") // clear value
         $('#tree_pct_check_op1_m').modal('hide')
       })

      } else if(treePctVal === 100 && mainStemVal === 2){
        $('#tree_pct_check_op2_m').modal('show')

        $( "#ok_tree_pct_op2_m" ).click(function() {
          $('#tree_percentage_m').val(" ") // clear value
          $('#tree_pct_check_op2_m').modal('hide')
        })

      } else if(treePctVal < 100 && mainStemVal === 1){
        $('#tree_pct_check_op3_m').modal('show')

        $( "#ok_tree_pct_op3_m" ).click(function() {
          $('#tree_percentage_m').val(" ") // clear value
          $('#tree_pct_check_op3_m').modal('hide')
        })

      } else if(treePctVal < 0 || treePctVal > 100){
        $('#tree_pct_check_op4_m').modal('show')

        $( "#ok_tree_pct_op4_m" ).click(function() {
          $('#tree_percentage_m').val(" ") // clear value
          $('#tree_pct_check_op4_m').modal('hide')
        })
    }
  })

}

function groundPercentageCheck_moratlity(){
  let groundPct = $('input#ground_percentage_m')

  groundPct.change(() =>{
    let groundPctVal = Number(groundPct.val())

    if(groundPctVal < -1 || groundPctVal > 100){
      $('#ground_pct_check_m').modal('show')

      $( "#ground_pct_check_m" ).click(function() {
        $('#ground_percentage_m').val(" ") // clear value
        $('#ground_pct_check_m').modal('hide')
      })

    } else {
      if(groundPctVal >= 0){
        value = 100 - groundPctVal
        $('input#support_percentage_m').val(value)
      } else if(groundPctVal == -1){
        value = -1
        $('input#support_percentage_m').val(value)
      }
    }
  })
}

function supportPercentageCheck_mortality(){
  supportPct = $('input#support_percentage_m')

  supportPct.change(() =>{
    let supportPctVal = Number(supportPct.val())

    if(supportPctVal < -1 || supportPctVal > 100){
      $('#support_pct_check_m').modal('show')

      $( "#support_pct_check_m" ).click(function() {
        $('#support_percentage_m').val(" ") // clear value
        $('#support_pct_check_m').modal('hide')
      })
    }
  })
}
