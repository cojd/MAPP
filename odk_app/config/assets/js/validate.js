function bindFormValidation()
{

  // possibly don't need this
  tag_validate();
  $('input#tag').change(() => { tag_validate(); });

  // tree_percentage_validate();
  // $('input#tree_percentage').change(() => { tree_percentage_validate(); });
  // $('input#crown_percentage').change(() => { tree_percentage_validate(); });

  /* Ingrowth  */

    // confirm that species is not null

    // tree status( setup )

    // dbh check


        // (possibly) do here
            // set up defualts for
                // canpoy class
                // crown ratio
                // overall vigor
                // main stem
                // rooting

  // crown percentage check

  // tree percentage check

  // mapping validation
    // from validation
    // distance validation


 /* Remeasure */

 /* Mortality */

//  let s = $('select#rooting');
// s.change(()=>{
//   console.log(s.val())
// })

// key = "main_stem"
// let e = $('#' + key)
// let a = e.data('options-list');
//
//   a.change(()=>{
//     console.log(a.val())
//   })
//////////////////////////////////////////////////////
// let a = $('select#main_stem')
// a.change(()=>{
//   aInt = Number(a.val())
//   console.log(typeof aInt)
// })
////////////////////////////////////////////////////
let b = $('input#crown_ratio')
b.change(()=>{
  console.log(b.val())
})

// testVal = ($('select#rooting').val());
// //testVal = $('#rooting:)
//
// console.log(testVal)
// alert(testVal)
// let t = $('select#main_stem').data('options-list');
// t.change(()=>{
//   console.log(t)
// })

// var test = document.getElementById("main_stem");
//
// var



// let e = $('#' + key);
//let e = $('#' + 'rooting');
//let a = e.data('prev-options-list');

// a.change(()=>{
//   console.log(2)
// })

// $('select[data-options-list]').each(function(){
//   // alert($(this).data("value"));
//   console.log($(this).data("value"))
// })

bindIngrowthValidate()

}

function setValidityMsg(elem, msg, defaultMsg)
{
  elem[0].setCustomValidity(msg);
  elem.next('.invalid-feedback').text(msg);
  if (defaultMsg) elem.next('.invalid-feedback').text(defaultMsg);
}

function tag_validate()
{
  let tag = $('input#tag');
  if (Number(tag.val()) !== 2) tag[0].setCustomValidity("");
  else                         tag[0].setCustomValidity("Tag number cannot be 2.");
}

// function tree_percentage_validate()
// {
//   let crown = Number($('input#crown_percentage').val());
//   let tree = $('input#tree_percentage');
//   let tree_val = Number(tree.val());
//   if (tree_val < crown)
//   {
//     setValidityMsg(tree, 'Tree % cannot be less then crown %.');
//   }
//   else if (tree_val > 100 || tree_val < 0)
//   {
//     setValidityMsg(tree, 'Tree percentage must be within the range 0-100.');
//   }
//   else setValidityMsg(tree, '', 'Tree percentage must be within the range 0-100.');
// }


function i_tree_status_check(){
  // if answer = 2
  // require 6-14
  // and some values need to be set in db
      // figure this part out later
}

function i_dbh_check(){
  // if value less than 5 cm give warning message
  // if value great by 10 cm then prevoius measurement give warning message
}
