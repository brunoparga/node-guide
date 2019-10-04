require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI,
    // Configuration required by deprecation warnings
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((client) => {
      db = client.db();
      callback();
    });
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw new Error('No database found!');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
