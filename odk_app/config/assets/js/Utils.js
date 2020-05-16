// REQUIRES StaticData.js TO BE INCLUDED IN THE HTML FILE

const Utils = {

  // create a unique id. used when creating a record in the DB
  genUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },

  // returns a string containing option elements from a json key/value list 
  genSelectOptions: function (OptionsJSON, filter) {
    var selectItems = '';
    $.each(OptionsJSON, (key, value) => {
      let item = '<option value=\'' + key + '\'>' + value + '</option>';

      // if we dont have a filter                 or the filter is true  add the items
      if (filter === undefined || filter === null || filter(key, value)) selectItems += item;
    });
    return selectItems;
  },

  // add option elements to every select with the data-options-list attribute set
  populateSelects: function (filter) {
    let option_output = {};
    $('select').each(function () {
      let elem = $(this);
      let list_name = elem.data('options_list'); // read in the list name from the select's data-options_list attribute
      if (!list_name) return; // if it didn't have options list set then continue

      if (!(list_name in option_output)) { // gen the options for that list if we haven't already
        option_output[list_name] = Utils.genSelectOptions(DataLists[list_name], filter);
      }
      // append them to the select
      elem.append(option_output[list_name]);
    });
  },

  save_value_to_params: function (key, value) {
    let params = JSON.parse(localStorage.getItem(Constants.LocalStorageKeys.SELECTION_PARAMS));
    params[key] = value;
    localStorage.setItem(Constants.LocalStorageKeys.SELECTION_PARAMS, JSON.stringify(params));
  },

}

Object.freeze(Utils);
