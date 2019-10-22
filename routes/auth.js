const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/signup', authController.getSignup);
router.post('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address.')
      .custom((value) => User.findOne({ email: value })
        .then((user) => {
          if (user) {
            return Promise.reject(new Error('Email already taken.'));
          }
          return true;
        })),
    body('password', 'Password must be at least 10 characters long.')
      .isLength({ min: 4, max: 128 }),
    body('confirmPassword', 'Passwords do not match.')
      .custom((value, { req }) => value === req.body.password),
  ],
  authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.post('/logout', authController.postLogout);

module.exports = router;
