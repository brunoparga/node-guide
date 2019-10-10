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
    // const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id)
    const updatedCart = { items: [{ productId: ObjectId(product._id), quantity: 1 }] };
    // this.cart = updatedCart;
    return getDb()
      .collection('users')
      .updateOne(
        { _id: ObjectId(this._id) },
        { $set: { cart: updatedCart } },
      );
  }

  static findById(userId) {
    return getDb().collection('users').findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;
