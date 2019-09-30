const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

const sequelize = require('./helpers/database');
const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pagesController = require('./controllers/pages');

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')));
// Prepend a path to these routes
app.use('/admin', adminRouter);
// But not these
app.use(shopRoutes);
// Fall back to sending a 404
app.use(pagesController.get404);

sequelize.sync()
  .then(() => {
    app.listen(3000);
  });
