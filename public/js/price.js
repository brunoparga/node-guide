const prices = document.querySelectorAll('.js-price');
prices.forEach((price) => {
  const newPrice = price;
  const value = parseFloat(price.innerText);
  newPrice.innerText = new Intl.NumberFormat(
    'en-US', { style: 'currency', currency: 'USD' },
  ).format(value);
});

const priceInput = document.querySelector('#price');
function setCents() {
  if (this.value < 0) { this.value = 0; }
  this.value = parseFloat(this.value).toFixed(2);
}
// priceInput.addEventListener('change', setCents)
priceInput.onchange = setCents;
