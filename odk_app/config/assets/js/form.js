// on document:ready
$(function () {
  // get params from session variables. (stand, plot, status, etc.)
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log('params');
  console.log(params);

  if (params.form_def) buildForm(params.form_def); // creates form elements based on definitions from FormDefs.js

  // add options to selects
  Utils.populateSelects();

  // grab prev tree record stored in session variables
  let prev = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS));
  console.log('prev');
  console.log(prev);
  populateFormFromPrev(prev, params.editing); // do stuff with the prev data

  // set these for ingrowth since it can't get them from prev
  if ('stand' in params) $('#stand').val(params.stand);
  if ('plot' in params) $('#plot').val(params.plot);
  // for the remeasure form specifically, since it needs to carry the selected status over from the picker screen
  if ('status' in params) {
    $('#status-display').val(params.status); // set the value of the select which the user can actually see
    $('#status').val(params.status); // set the value of the hidden input

    // we have to do it this way since <select> elements don't have proper support for the readonly attribute
    // setting the status select as disabled prevents the user from clicking on the select to change its value
    // however, that also removes it from the form's output when we serialize it later on

    // having a disabled select and a hidden input solves this issue
  }

  // set up custom form validation if it was included
  if (typeof bindFormValidation == "function") bindFormValidation(); // function from validate.js

  watchForm(params); // catch / handle form submission
});

function handleViewDataForEdit(inputs)
{
  let success = function (result) {
    $.each(inputs, function () { // just set the value of each input with column_name set to prev[column_name]
      let e = $(this);
      let key = e.data('column_name');
      let value = result.get(key);
      e.val(value);
    });
  }

  let failure = function(error) {
    console.log('record_detail.js getViewData error: ' + error);
  }

  odkData.getViewData(success, failure);
}

// add the previous data to the DOM somehow, where applicable
function populateFormFromPrev(prev, editing) {
  let inputs = $('[data-column_name]');
  if (editing === true) // if editing is set to true
  {
    handleViewDataForEdit(inputs);
  }
  else // otherwise follow what is set in prev_action for every element with column_name set
  {
    // iterate through each value in prev
    $.each(inputs, function() {
      let e = $(this); // grab the element with column_name=key
      let a = e.data('prev_action');
      
      if (!a) return; // continue if it didnt have prev_action set
      
      let key = e.data('column_name');
      let value = prev[key];
      console.log(`populateFormFromPrev: ${key}: ${value}`);
      if (a === "replace") {
        e.val(value); // if the action is replace then just set the value
      }
      else if (a === "prepend") { // otherwise append some html somewhere relative to the input
        let l = e.prev('label');
        let b = ` <span class="badge badge-success">Previously ${value}</span>`;
        l.append(b);
      }
    });
  }

  // $('#species-display').val(prev['species']); // do this for species in remeasure. need to carry this along but cant do it through the loop above. same thing as status
}

///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// HANDLE FORM CREATION
///////////////////////////////////////////////////////////

function buildSections(sections) {
  let final_html = $(`<div class="card-body"></div>`);
  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];
    if (section.header) final_html += `<h5 class="mb-0">${section.header}</h5><hr/>`;

    // add input elements
    for (let j = 0; j < section.inputs.length; j++) {
      let input = section.inputs[j];
      let id = (input.id ? input.id : input.column_name);
      let group_html = $(`
        <div class="form-group">
          <label for="${id}">${input.label}</label>
        </div>
      `);
      let elem_html = null;
      // first check if were adding one of the three supported types
      if (input.html_element === 'input') {
        elem_html = $(`<input class="form-control" name="${input.column_name}" id="${id}">`);
      }
      else if (input.html_element === 'select') {
        let special = input.readonly && !input.disabled;
        elem_html = $(`
          <select class="form-control" name="${input.column_name}" id="${input.column_name}">
            <option value="">${(input.default_option ? input.default_option : "Please select an option...")}</option>
          </select>
        `);
        if (special) // selects dont have proper support for readonly so we create a hidden input and a disabled select as a workaround
        {
          elem_html.attr({ readonly: true, disabled: true });
          group_html.append(`<input type="hidden" name="${input.column_name}" id="${id}">`);
        }
      }
      else if (input.html_element === 'textarea') {
        elem_html = $(`<textarea class="form-control" name="${input.column_name}" id="${id}"></textarea>`);
      }
      else if ('raw_html' in input) // if it wasnt one of those but we have something in raw html
      {
        final_html.append(input.raw_html); // append that
        continue;
      }
      else continue; // if raw_html wasn't there either just skip the object

      group_html.append(elem_html);
      let elem = group_html.find(input.html_element);
      if ('column_name' in input) elem.attr('data-column_name', input.column_name);
      if ('html_attributes' in input) elem.attr(input.html_attributes);
      if ('data_attributes' in input) elem.data(input.data_attributes);
      if ('invalid_feedback' in input) group_html.append(`<div class="invalid-feedback">${input.invalid_feedback}</div>`);
      if (input.readonly === true) elem.prop('readonly', true);
      if (input.disabled === true) elem.prop('disabled', true);
      final_html.append(group_html);
    }
  }

  return final_html;
}

function buildCards(f, fd) {
  // iterate through and add cards
  for (let i = 0; i < fd.cards.length; i++) {
    let card = fd.cards[i];
    // create skeleton for card
    let card_html = $(`
      <div class="card" id="${card.id}-card"></div>
    `);
    let header_html = $(`
      <div class="card-header" id="${card.id}-header">${card.header}</div>
    `);
    let body_html = buildSections(card.sections);

    if (card.collapsable) {
      header_html.html(`
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${card.id}-collapse" aria-expanded="false" aria-controls="${card.id}-collapse">
          ${card.header}
        </button>
      `);
      body_html = $(`<div id="${card.id}-collapse" class="collapse ${(card.collapsed === true ? '' : 'show')}" aria-labelledby="${card.id}-header" data-parent="#${card.id}-accordion"></div>`).append(body_html);
      card_html.append(header_html).append(body_html);
      card_html = $(`<div class="accordion" id="${card.id}-accordion"></div>`).append(card_html); // nest the card in the accordion
    }
    else {
      card_html.append(header_html).append(body_html);
    }

    f.append(card_html);
  }
}

function buildForm(form) {
  let f = $('form');
  let fd = FORM_DEFS[form];

  // build form off ov form_def
  f.data('table', fd.table); // add table data attribute; corresponds to table name in odk
  f.append(`<h3 class="mb-0">${fd.header}</h3>`); // append form header
  buildCards(f, fd); // builds and appends cards to form
  // append submit and back buttons
  f.append(` 
    <button type="submit" class="btn btn-primary">Submit</button>
    <button type="button" onClick="odkCommon.closeWindow(0, null)" class="btn btn-danger">Back</button>
  `);
  // its important to have the type of the cancel button set to button so it doesnt also submit the form when clicked
  // just about lost my mind for a minute when that was happening. seems to defualt to submit
}

///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// HANDLE FORM SUBMISSION
///////////////////////////////////////////////////////////

function watchForm(params) {
  // grab form data on submit
  let f = $("form");
  f.submit(function (event) {
    event.preventDefault();  // prevent default action
    event.stopPropagation();
    let data = formatFormData(f.serializeArray()); // grab the form data and pass it to the formatter
    console.log(data);

    if (f[0].checkValidity() === false) {
      // if the form is not valid
      f.addClass('was-validated'); // add the class so bootstrap can do its thing
    }
    else if (params.editing === true) {
      editRow(f.data('table'), params.rowId, data);
    }
    else {
      createRow(f.data('table'), data); // pass it and the form data-table attribute to the create row function
    }
  });
}

// translate from what serializeArray does to what odkData will accept
function formatFormData(formData) {
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

function createRow(tableId, data) {
  var success = function (result) {
    console.log("SUCCESS!");
    console.log(result);

    // reset params and exit window
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
    let np = { type: params.type, stand: params.stand, form_def: tableId };
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) np.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(np))
    odkCommon.closeWindow(0, null);
  }

  console.log(tableId);
  odkData.addRow(tableId, data, Utils.genUUID(), success, console.log);
}

function editRow(tableId, rowId, data) {
  let success = function (result) {
    console.log("SUCCESS!");
    console.log(result);

    // reset params and exit window
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
    let np = { type: params.type, stand: params.stand, form_def: tableId, editing: true };
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) np.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(np))
    odkCommon.closeWindow(0, null);
  }

  odkData.updateRow(tableId, data, rowId, success, console.log);
}
