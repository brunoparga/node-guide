require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

// const User = require('./models/user');

// Import routes
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pagesController = require('./controllers/pages');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')));
// Make dummy user available everywhere
// app.use((req, _res, next) => {
//   User.findById('5d97caec1c9d44000038eed7')
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     });
// });
// Prepend a path to these routes
app.use('/admin', adminRouter);
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
    app.listen(3000);
  });
