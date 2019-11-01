require('dotenv').config();
const path = require('path');
const fs = require('fs');

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const csrfProtection = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const multer = require('multer');
const morgan = require('morgan');

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

const stream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session);
app.use(csrfProtection());
app.use(flash());
app.use(setUser);
app.use(setLocals);
app.use(routes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 3000));
