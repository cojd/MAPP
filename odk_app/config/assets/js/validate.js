function bindFormValidation()
{
  tag_validate();
  $('input#tag').change(() => { tag_validate(); });
  
  tree_percentage_validate();
  $('input#tree_percentage').change(() => { tree_percentage_validate(); });
  $('input#crown_percentage').change(() => { tree_percentage_validate(); });
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

function tree_percentage_validate()
{
  let crown = Number($('input#crown_percentage').val());
  let tree = $('input#tree_percentage');
  let tree_val = Number(tree.val());
  if (tree_val < crown)
  {
    setValidityMsg(tree, 'Tree % cannot be less then crown %.');
  }
  else if (tree_val > 100 || tree_val < 0)
  {
    setValidityMsg(tree, 'Tree percentage must be within the range 0-100.');
  }
  else setValidityMsg(tree, '', 'Tree percentage must be within the range 0-100.');
}
