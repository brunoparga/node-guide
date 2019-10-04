const { getDb } = require('../helpers/database');

class Product {
  constructor(title, imageURL, price, description) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save() {

  }
}

module.exports = Product;
