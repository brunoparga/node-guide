const { ObjectId } = require('mongodb');
const { getDb } = require('../helpers/database');

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    return getDb().collection('users').insertOne(this);
  }

  addToCart(product) {
    const productIndex = this.cart.items
      .findIndex((cp) => cp.productId.toString() === product._id.toString());

    let newQuantity = 1;
    const updatedItems = [...this.cart.items];

    if (productIndex >= 0) {
      newQuantity = this.cart.items[productIndex].quantity + 1;
      updatedItems[productIndex].quantity = newQuantity;
    } else {
      updatedItems.push({ productId: ObjectId(product._id), quantity: newQuantity });
    }

    return getDb()
      .collection('users')
      .updateOne(
        { _id: ObjectId(this._id) },
        { $set: { cart: { items: updatedItems } } },
      );
  }

  static findById(userId) {
    return getDb().collection('users').findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;
