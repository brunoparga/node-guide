const db = require('../helpers/database');
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {

  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {

  }
};
