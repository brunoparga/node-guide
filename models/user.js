const { ObjectId } = require('mongodb');
const { getDb } = require('../helpers/database');

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    return getDb().collection('users').insertOne(this);
  }

  static findById(userId) {
    return getDb().collection('users').findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;
