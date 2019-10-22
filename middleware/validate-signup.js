const { body } = require('express-validator');
const User = require('../models/user');

module.exports = [
  body('email')
    .custom((value) => User.findOne({ email: value })
      .then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already taken.'));
        }
        return true;
      })),
  body('confirmPassword', 'Passwords do not match.')
    .custom((value, { req }) => value === req.body.password),
];
