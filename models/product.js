const { ObjectId } = require('mongodb');
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

  static findById(prodId) {
    return getDb()
      .collection('products')
      .find({ _id: ObjectId(prodId) })
      .next()
      .then((product) => product);
  }
}

module.exports = Product;
