const router = require('express').Router();
const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.post('/cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart-delete-item', isAuth, shopController.postRemoveFromCart);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
