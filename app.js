require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
app.set('view engine', 'ejs');
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

const User = require('./models/user');

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const pagesController = require('./controllers/pages');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')));
// Set up server-side stored sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
// Put the user in the request
app.use((req, _res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id).then((user) => { req.user = user; });
  }
  next();
});
// Prepend a path to these routes
app.use('/admin', adminRoutes);
// But not these
app.use(authRoutes);
app.use(shopRoutes);
// Fall back to sending a 404
app.use(pagesController.get404);

mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          new User({
            name: 'Bruno',
            email: 'ceo@superstore.com',
            cart: {
              items: [],
            },
          }).save();
        }
      });
    app.listen(3000);
  });
