const { getDb } = require('../helpers/database');

class Product {
  constructor(title, imageURL, price, description) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save() {
    return getDb()
      .collection('products')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
