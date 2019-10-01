const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

// Import DB and models
const sequelize = require('./helpers/database');
const Product = require('./models/product');
const User = require('./models/user');

// Import routes
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pagesController = require('./controllers/pages');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')));
// Make dummy user available everywhere
app.use((req, _res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    });
});
// Prepend a path to these routes
app.use('/admin', adminRouter);
// But not these
app.use(shopRoutes);
// Fall back to sending a 404
app.use(pagesController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
sequelize.sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'Dumb E.U. Sr',
        email: 'dummy@user.com',
      });
    }
    // This Promise is here to make it explicit that both branches return a
    // Promise. It could be left implicit due to being in a 'then' callback.
    return Promise.resolve(user);
  })
  .then(() => {
    app.listen(3000);
  });
