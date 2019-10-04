const { ObjectId } = require('mongodb');
const { getDb } = require('../helpers/database');

class Product {
  constructor(title, imageURL, price, description, id) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
    this.id = id ? ObjectId(id) : null;
  }

  save() {
    const handle = getDb().collection('products');
    if (this.id) {
      return handle.updateOne({ _id: this.id }, { $set: this });
    }
    return handle.insertOne(this);
  }

  static fetchAll() {
    return getDb().collection('products').find().toArray();
  }

  static findById(prodId) {
    return getDb().collection('products').find({ _id: ObjectId(prodId) }).next();
  }

  static deleteById(prodId) {
    return getDb().collection('products').deleteOne({ _id: ObjectId(prodId) });
  }
}

module.exports = Product;
