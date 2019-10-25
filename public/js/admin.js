/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "deleteProduct" }] */
const deleteProduct = (btn) => {
  const _id = btn.parentNode.querySelector('[name=_id]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.closest('article');

  fetch(`/admin/product/${_id}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrf },
  })
    .then((result) => result.json())
    .then(() => productElement.parentNode.removeChild(productElement));
};
