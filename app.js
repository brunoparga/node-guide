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
const routes = require('./routes/routes');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
app.use(csrfProtection());
app.use(flash());
app.use(setUser);
app.use(setLocals);
app.use(routes);

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000));
