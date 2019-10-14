// const { ObjectId } = require('mongodb');
// const { getDb } = require('../helpers/database');

// class Product {
//   constructor(title, imageURL, price, description, _id, userId) {
//     this.title = title;
//     this.imageURL = imageURL;
//     this.price = price;
//     this.description = description;
//     this._id = _id ? ObjectId(_id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const handle = getDb().collection('products');
//     if (this._id) {
//       return handle.updateOne({ _id: this._id }, { $set: this });
//     }
//     return handle.insertOne(this);
//   }

//   static fetchAll() {
//     return getDb().collection('products').find().toArray();
//   }

//   static findById(prodId) {
//     return getDb().collection('products').findOne({ _id: ObjectId(prodId) });
//   }

//   static deleteById(prodId) {
//     return getDb().collection('products').deleteOne({ _id: ObjectId(prodId) });
//   }
// }

// module.exports = Product;
