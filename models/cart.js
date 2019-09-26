const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json',
);

module.exports = class Cart {
  // Either read an existing cart from file, or create an empty one.
  // Inputs are error from fileRead and contents of file; output is an object.
  static setCart(err, fileContent) {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cart = JSON.parse(fileContent);
    }
    return cart;
  }

  // Increase quantity of product that already exists and is added anew to
  // the cart.
  // Inputs are a cart object, a product object, and its index in the cart's
  // products array.
  // Output is a cart object.
  static updateProduct(cart, product, index) {
    const updatedProduct = { ...product };
    updatedProduct.qty = product.qty + 1;
    const updatedCart = { ...cart };
    updatedCart.products[index] = updatedProduct;
    return updatedCart;
  }

  // Either add new product or increase existing one; update price either way.
  // Inputs: a cart object, a product object, the product's index in the cart's
  // products array, the product's id and the product's price
  // Output: a cart object
  static updateCart(cart, product, index, id, price) {
    let updatedCart = { ...cart };
    if (product) {
      updatedCart = this.updateProduct(cart, product, index);
    } else {
      updatedCart.products = [...cart.products, { id, qty: 1 }];
    }
    updatedCart.totalPrice += +price;
    return updatedCart;
  }

  // Read the existing cart from file, add a new product to it and write the
  // updated version to file.
  // Inputs are the product's id and price.
  // Output is void.
  static addProduct(id, productPrice) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = this.setCart(err, fileContent);

      // Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];

      cart = this.updateCart(cart, existingProduct, existingProductIndex, id, productPrice);
      fs.writeFile(filePath, JSON.stringify(cart), () => { });
    });
  }
};
