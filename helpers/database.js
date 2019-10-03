const { MongoClient } = require('mongodb');

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://brunoparga:5KJMQ5F97T5XUNMGKB65L8DKX53BB@cluster0-jhvlt.mongodb.net/admin?retryWrites=true&w=majority',
    // Configuration required by deprecation warnings
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
    .then((client) => {
      callback(client);
    });
};

module.exports = mongoConnect;
