require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const csrfProtection = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const multer = require('multer');

const session = require('./middleware/session');
const setUser = require('./middleware/set-user');
const setLocals = require('./middleware/set-locals');
const routes = require('./routes/routes');
const errorHandler = require('./middleware/error');

const app = express();
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) => cb(null,
    `${new Date().toISOString()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => cb(null,
  ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
app.use(csrfProtection());
app.use(flash());
app.use(setUser);
app.use(setLocals);
app.use(routes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000));
