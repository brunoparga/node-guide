const router = require('express').Router();
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');
const validate = require('../middleware/validate-product');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, validate, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, validate, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
