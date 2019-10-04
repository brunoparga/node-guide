const { MongoClient } = require('mongodb');

let db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://brunoparga:5KJMQ5F97T5XUNMGKB65L8DKX53BB@cluster0-jhvlt.mongodb.net/shop?retryWrites=true&w=majority',
    // Configuration required by deprecation warnings
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
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
