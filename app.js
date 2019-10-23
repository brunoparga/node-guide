require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const csrfProtection = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const session = require('./middleware/session');
const setUser = require('./middleware/set-user');
const setLocals = require('./middleware/set-locals');

const app = express();
app.set('view engine', 'ejs');

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
app.use(session);
// Protect against CSRF attacks
app.use(csrfProtection());
// Set up flash messages in the request
app.use(flash());
// Put the user in the request
app.use(setUser);
// Assign values available on all views
app.use(setLocals);
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
    app.listen(3000);
  });
