// on document:ready
$(function () {

  // add options to selects
  // populateSelects();
  Utils.populateSelects();

  // set up custom form validation
  bindFormValidation(); // function from validate.js

  // get params from session variables. (stand, plot, status, etc.)
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log('params');
  console.log(params);
  // for the remeasure form specifically, since it needs to carry the selected status over from the picker screen
  if (params.status)
  {
    $('#display_status').val(params.status); // set the value of the select which the user can actually see
    $('#status').val(params.status); // set the value of the hidden input

    // we have to do it this way since <select> elements don't have proper support for the readonly attribute
    // setting the status select as disabled prevents the user from clicking on the select to change its value
    // however, that also removes it from the form's output when we serialize it later on

    // having a disabled select and a hidden input solves this issue
  }

  // grab prev tree record stored in session variables
  let prev   = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS));
  console.log('prev');
  console.log(prev);
  populateFormFromPrev(prev); // do stuff with the prev data

  watchForm(); // catch / handle form submission

});

// add the previous data to the DOM somehow, where applicable
function populateFormFromPrev(prev)
{
  // iterate through
  $.each(prev, (key, value) => {
    if (key !== '_id')
    {
      let e = $('[name=\"' + key + '\"][data-prev-action]'); // grab the element with name=key and has a data-prev-action set
      let a = e.data('prev-action');
      console.log("populateFormFromPrev: " + key + ": " + value);
      if (a === "replace")
      {
        e.val(value); // if the action is replace then just set the value
      }
      else if (a === "prepend")
      { // otherwise append some html somewhere relative to the input
        let l = e.prev('label');
        let b = ' <span class="badge badge-success">Previous ' + value + '</span>';
        l.append(b);
        // let h = `<div class="input-group-prepend">
        //           <span class="input-group-text" id="inputGroupPrepend">Was: `+ value +`</span>
        //         </div>`
        // $(h).insertBefore(e);
      }
    }
  });
}

///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// HANDLE FORM DATA
///////////////////////////////////////////////////////////

function watchForm()
{
  // grab form data on submit
  let f = $("form");
  f.submit(function (event) {
    event.preventDefault();  // prevent default action
    event.stopPropagation();

    if (f[0].checkValidity() === false)
    {
      // if the form is not valid
      f.addClass('was-validated'); // add the class so bootstrap can do its thing
    }
    else
    {
      let data = formatFormData(f.serializeArray()); // grab the form data and pass it to the formatter
      console.log(data);
      createRow(f.attr('id'), data); // pass it and the form id to the create row function
    }
  });
}

// translate from what serializeArray does to what odkData will accept
function formatFormData(formData)
{
  let data = {};
  for (let i = 0; i < formData.length; i++) // serializeArray outputs a 2d array for the form [["key", "value"], ...]
  {
    let item = formData[i]; // grab the item from the serialized form data
    if (item.value !== '' && item.value !== null && item.value !== undefined) { // as long as it isnt empty or null
      data[item.name] = item.value; // add it to our output as a key value pair
    }
  }
  return data; // our output is a JSON object of the form {"key":"value", ...}
}

function createRow(tableID, data)
{
  var success = function (result) {
    console.log("SUCCESS!");
    console.log(result);

    // reset params and exit window
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
    let np = {type: params.type, stand: params.stand};
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) np.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(np))
    odkCommon.closeWindow(0, null);
  }

  var failure = function (errorMsg) {
    console.log("FAILURE");
    console.log(errorMsg);
  }

  console.log(tableID);
  odkData.addRow(tableID, data, Utils.genUUID(), success, failure);
}
