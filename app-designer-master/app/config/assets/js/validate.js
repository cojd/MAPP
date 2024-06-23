function bindFormValidation()
{

  tag_validate();
  $('input#tag').change(() => { tag_validate(); });

  bindIngrowthValidate()

  bindRemeasureValidate()

  bindMortalityValidtate()
}

function setValidityMsg(elem, msg, defaultMsg)
{
  elem[0].setCustomValidity(msg);
  elem.next('.invalid-feedback').text(msg);
  if (defaultMsg) elem.next('.invalid-feedback').text(defaultMsg);
}

//possibly remove
function tag_validate()
{
  let tag = $('input#tag');
  if (tag.length)
  {
    if (Number(tag.val()) !== 2) tag[0].setCustomValidity("");
    else                         tag[0].setCustomValidity("Tag number cannot be 2.");
  }
}
