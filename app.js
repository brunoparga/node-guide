require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const config = require('./middleware/config');
const routes = require('./routes/routes');
const errorController = require('./controllers/error');
const errorHandler = require('./middleware/error');

const app = express();
app.set('view engine', 'ejs');

app.use(config);
app.use(routes);
app.use(errorController.get404);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 3000));
