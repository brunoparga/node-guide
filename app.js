require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

const User = require('./models/user');

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pagesController = require('./controllers/pages');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')));
// Make dummy user available everywhere
app.use((req, _res, next) => {
  User.findById('5da78d888ccb1f3c98043d2b')
    .then((user) => {
      req.user = user;
      next();
    });
});
// Prepend a path to these routes
app.use('/admin', adminRoutes);
// But not these
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
