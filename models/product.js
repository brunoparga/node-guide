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
      .insertOne(this);
  }

  static fetchAll() {
    return getDb().collection('products').find().toArray();
  }
}

module.exports = Product;
