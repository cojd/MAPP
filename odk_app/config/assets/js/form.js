// on document:ready
$(function () {
  // get params from session variables. (stand, plot, status, etc.)
  let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
  console.log('params:');
  console.log(params);

  if (params.form_def) buildForm(params.form_def, params.editing); // creates form elements based on definitions from FormDefs.js
  else
  {
    alert('form_def was not set somehow, so the form can\'t be built. This is a bug.');
    return;
  }

  // add options to selects
  Utils.populateSelects();

  // grab prev tree record stored in session variables if it exists
  let ls_prev_string = localStorage.getItem(Constants.LocalStorageKeys.TREE_QUERY_RESULTS);
  if (ls_prev_string !== "undefined") // why would they do this to us
  {
    let prev = JSON.parse(ls_prev_string);
    console.log('prev:');
    console.log(prev);

    if (prev !== null) populateFormFromPrev(prev); // do stuff with the prev data
  }

  // set up custom form validation if it was included
  if (typeof bindFormValidation == "function") bindFormValidation(); // function from validate.js

  // insert the current data from the record if we're editing a record
  if (params.editing) populateFormForEdit();

  // set these for ingrowth since it can't get them from prev
  if ('stand' in params) $('#stand').val(params.stand);
  if ('plot' in params) $('#plot').val(params.plot);
  // for the remeasure form specifically, since it needs to carry the selected status over from the picker screen
  if ('status' in params) {
    $('#status-display').val(params.status); // set the value of the select which the user can actually see
    $('#status').val(params.status); // set the value of the hidden input

    // selects which get their values auto-filled from prev will get their hidden elements set in populateFormFromPrev
    // however, the value for status is set in tag_picker.html so we have to set it separately here
    // status gets set to prev_status during populateFormFromPrev, so here we set it to the correct value
  }

  watchForm(params); // catch / handle form submission
});

///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// HANDLE FORM VALUE POPULATION
///////////////////////////////////////////////////////////

// add the previous data to the form somehow, where applicable
function populateFormFromPrev(prev) {
  let inputs = $('[data-column_name]');
  // iterate through each of the inputs with data-column_name set
  $.each(inputs, function() {
    let e = $(this); // grab the element with column_name=key
    let a = e.data('prev_action');

    if (!a) return; // continue if it didnt have prev_action set

    let key = e.data('column_name');
    let value = prev[key];
    console.log(`populateFormFromPrev: ${key}: ${value}`);
    if (a === "prepend") {
      // append some html somewhere relative to the input
      let l = e.prev('label');
      let b = ` <span class="badge badge-success">Previously ${value}</span>`;
      l.append(b);
    }
    else if (a === "replace") e.val(value); // if the action is replace then just set the value
  });
}

function populateFormForEdit()
{
  let viewSuccess = function (viewResults) {
    let inputs = $('[data-column_name]');
    $.each(inputs, function () { // just set the value of each input with column_name set to its value from the view
      let e = $(this);
      let key = e.data('column_name');
      let value = viewResults.get(key);
      if (value !== null && value !== undefined) e.val(value); // replace all input values with the actual values for the record being edited
    });
  }
  odkData.getViewData(viewSuccess, console.log); // if we get data we go to success, otherwise log the error
}

///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// HANDLE FORM CREATION
///////////////////////////////////////////////////////////

function buildSections(sections) {
  let final_html = $(`<div class="card-body"></div>`);
  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];
    if (section.header) final_html.append(`<h5 class="mb-0">${section.header}</h5><hr/>`);

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

      /////////////////////////////////////////////////
      // ADDING INPUT ELEMENT
      /////////////////////////////////////////////////
      if (input.html_element === 'input') {
        elem_html = $(`<input class="form-control" name="${input.column_name}" id="${id}">`);
      }
      /////////////////////////////////////////////////
      // ADDING SELECT ELEMENT
      /////////////////////////////////////////////////
      else if (input.html_element === 'select') {
        let special = input.readonly && !input.disabled;
        let special_suffix = (special ? '-display' : '');
        
        elem_html = $(`
        <select class="form-control" name="${input.column_name + special_suffix}" id="${id + special_suffix}">
        <option value="">${(input.default_option ? input.default_option : "Please select an option...")}</option>
        </select>
        `);
        if (special)
        {
          // we have to do it this way since <select> elements don't have proper support for the readonly attribute
          // setting the a select as disabled prevents the user from clicking on the select to change its value
          // however, that also removes it from the form's output when we serialize it later on
          
          // having a disabled select and a hidden input solves this issue
          
          elem_html.attr({ readonly: true, disabled: true });
          let hidden_input = $(`<input type="hidden" name="${input.column_name}" id="${id}" ${(special ? `data-column_name="${input.column_name}"` : '')}>`);
          hidden_input.data('prev_action', input.data_attributes.prev_action); // this prev_action will probably always be replace
          group_html.append(hidden_input);
        }
      }
      /////////////////////////////////////////////////
      // ADDING TEXTAREA ELEMENT
      /////////////////////////////////////////////////
      else if (input.html_element === 'textarea') {
        elem_html = $(`<textarea class="form-control" name="${input.column_name}" id="${id}"></textarea>`);
      }
      /////////////////////////////////////////////////
      // ADDING MODAL
      /////////////////////////////////////////////////
      else if (input.modal === true)
      {
        let mdl = FormTemplates.modal(input);
        final_html.append(mdl);
        continue;
      }
      /////////////////////////////////////////////////
      // ADDING THROUGH RAW_HTML
      /////////////////////////////////////////////////
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
      <div class="card-header" id="${card.id}-header"><strong>${card.header}</strong></div>
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

function buildForm(form, editing) {
  let f = $('form');
  let fd = FORM_DEFS[form];

  // build form off ov form_def
  f.data('table', fd.table); // add table data attribute; corresponds to table name in odk
  f.append(`<h3 class="mb-0">${fd.header}</h3>`); // append form header
  buildCards(f, fd); // builds and appends cards to form
  // append submit and back buttons
  f.append(`
    <button type="submit" class="btn btn-primary">${(editing ? 'Update' : 'Submit')}</button>
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
    console.log(data.dbh);
    //NOTE: previous dbh was only added for viewing
    // delete previous dbh, so form can be submitted
    if (params.form_def && params.form_def == "mortality") delete data.dbh;


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
  return data; // our output is a JS object of the form {"key":"value", ...}
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
  odkData.addRow(tableId, data, odkCommon.genUUID(), success, console.log);
}

function editRow(tableId, rowId, data) {
  let success = function (result) {
    console.log("SUCCESS!");
    console.log(result);

    // reset params and exit window
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
    let np = { type: params.type, stand: params.stand, form_def: params.form_def, editing: true };
    if (params.type === Constants.PlotTypes.FIXED_RADIUS_PLOT) np.plot = params.plot;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(np))
    odkCommon.closeWindow(0, null);
  }

  odkData.updateRow(tableId, data, rowId, success, console.log);
}
