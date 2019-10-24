const { body } = require('express-validator');

module.exports = [
  body('title')
    .isString()
    .withMessage('Product title must have only letters and numbers.')
    .isLength({ min: 3 })
    .withMessage('Product title must be at least 3 characters long.')
    .trim(),
  body('price')
    .isDecimal({ decimal_digits: '2' })
    .withMessage('Price must be a value with cents.')
    .isFloat({ gt: 0.0 })
    .withMessage('Price must be positive.'),
  body('description', 'Description must be at least 6 characters long.')
    .isLength({ min: 6, max: 400 }).trim(),
];
