const { body } = require('express-validator');

module.exports = [
  body('email', 'Invalid email address').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 4 characters long.')
    .isLength({ min: 4, max: 128 })
    .trim(),
  body('confirmPassword').trim(),
];
