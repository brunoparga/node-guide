const path = require('path');

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const csrfProtection = require('csurf');
const flash = require('connect-flash');

const multer = require('./multer-config');
const session = require('./session');
const setUser = require('./set-user');
const setLocals = require('./set-locals');

module.exports = [
  helmet(),
  compression(),
  bodyParser.urlencoded({ extended: true }),
  multer,
  express.static(path.join(__dirname, '..', 'public')),
  session,
  csrfProtection(),
  flash(),
  setUser,
  setLocals,
];
