function populateSelect(selectElem, OptionsJSON) 
{
  var selectItems = '';
  $.each(OptionsJSON, (key, value) => {
    let item = '<option value=\'' + key + '\'>' + value + '</option>';
    // console.log(item);
    selectItems += item;
  });
  if (selectElem) selectElem.append(selectItems);
  return selectItems;
}

function genSelects()
{
  populateSelect($('select#species'),       DataLists.SpeciesList);
  populateSelect($('select#status'),        DataLists.StatusList);
  populateSelect($('select#canopy_class'),  DataLists.CanopyClassList);
  populateSelect($('select#overall_vigor'), DataLists.TreeVigorList);
  populateSelect($('select#main_stem'),     DataLists.MainStemList);
  populateSelect($('select#rooting'),       DataLists.RootingList);
  let options = populateSelect(null, DataLists.CommentList);
  $('select#comment_1').append(options);
  $('select#comment_2').append(options);
  $('select#comment_3').append(options);
  $('select#comment_4').append(options);
  options = populateSelect(null, DataLists.ConditionList);
  $('select#condition_1').append(options);
  $('select#condition_2').append(options);
  $('select#condition_3').append(options);
  $('select#condition_4').append(options);
  options = populateSelect(null, DataLists.ProximatePredisposingList);
  $('select#proximate').append(options);
  $('select#predisposing').append(options);
  options = populateSelect(null, DataLists.MortalityCommentList);
  $('select#mortality_comment_1').append(options);
  $('select#mortality_comment_2').append(options);
  $('select#mortality_comment_3').append(options);
}

// on document:ready
$(function () {
  // add options to selects
  genSelects();
  
  // grab form data on submit
  let f = $("form");
  f.submit(function (event) {
    event.preventDefault();
    let data = formatFormData(f.serializeArray());
    console.log(data);
    createRow(f.attr('id'), data);
  });
});

function formatFormData(formData)
{
  let data = {};
  for (let i = 0; i < formData.length; i++)
  {
    let item = formData[i];
    data[item.name] = item.value;
  }
  return data;
}

function createRow(tableID, data)
{
  var genUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  var successFnCreate = function (result) {
    console.log("SUCCESS!");
    console.log(result);
    window.history.back();
    // window.location.replace('../index.html');
  }

  var failureFnCreate = function (errorMsg) {
    console.log("FAILURE");
    console.log(errorMsg);
  }
  
  console.log(tableID);
  odkData.addRow(tableID, data, genUUID(), successFnCreate, failureFnCreate);
}
