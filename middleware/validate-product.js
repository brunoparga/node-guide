const { body } = require('express-validator');

module.exports = [
  body('title')
    .isString()
    .withMessage('Product title must have only letters and numbers.')
    .isLength({ min: 3 })
    .withMessage('Product title must be at least 3 characters long.')
    .trim(),
  body('imageURL', 'URL must be valid.').isURL(),
  body('price', 'Price must be a number with cents.').isFloat(),
  body('description', 'Description must be at least 6 characters long.')
    .isLength({ min: 6, max: 400 }).trim(),
];
