const router = require('express').Router();
const authController = require('../controllers/auth');
const validateLogin = require('../middleware/validate-login');
const validateSignup = require('../middleware/validate-signup');

router.get('/signup', authController.getSignup);
router.post('/signup', validateLogin, validateSignup, authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', validateLogin, authController.postLogin);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.post('/logout', authController.postLogout);

module.exports = router;
