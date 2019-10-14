// const { ObjectId } = require('mongodb');
// const { getDb } = require('../helpers/database');

// class User {
//   constructor(username, email, cart, _id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//   }

//   save() {
//     return getDb().collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     const productIndex = this.cart.items
//       .findIndex((cp) => cp.productId.toString() === product._id.toString());

//     let newQuantity = 1;
//     const updatedItems = [...this.cart.items];

//     if (productIndex >= 0) {
//       newQuantity = this.cart.items[productIndex].quantity + 1;
//       updatedItems[productIndex].quantity = newQuantity;
//     } else {
//       updatedItems.push({ productId: ObjectId(product._id), quantity: newQuantity });
//     }

//     return getDb()
//       .collection('users')
//       .updateOne(
//         { _id: ObjectId(this._id) },
//         { $set: { cart: { items: updatedItems } } },
//       );
//   }

//   getCart() {
//     // This doesn't work because of Promises. Maybe with async/await?
//     // return this.cart.items.map((item) => {
//     //   return getDb().collection('products').findOne({ _id: item.productId })
//     //     .then((product) => {
//     //       return { ...product, quantity: item.quantity }
//     //     });
//     // });
//     return getDb()
//       .collection('products')
//       .find({ _id: { $in: this.cart.items.map((item) => item.productId) } })
//       .toArray()
//       .then((products) => products.map((product) => ({
//         ...product,
//         quantity: this.cart.items
//           .find((item) => item.productId.toString() === product._id.toString())
//           .quantity,
//       })));
//   }

//   removeFromCart(productId) {
//     const updatedItems = this.cart.items
//       .filter((item) => item.productId.toString() !== productId.toString());
//     return getDb()
//       .collection('users')
//       .updateOne(
//         { _id: ObjectId(this._id) },
//         { $set: { cart: { items: updatedItems } } },
//       );
//   }

//   addOrder() {
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return getDb().collection('orders').insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return getDb()
//           .collection('users')
//           .updateOne(
//             { _id: ObjectId(this._id) },
//             { $set: { cart: this.cart } },
//           );
//       });
//   }

//   getOrders() {
//     return getDb()
//       .collection('orders')
//       .find({ 'user._id': ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     return getDb().collection('users').findOne({ _id: ObjectId(userId) });
//   }
// }

// module.exports = User;
