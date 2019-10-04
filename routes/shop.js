const router = require('express').Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
// router.get('/products/:productId', shopController.getProduct);
// router.post('/cart', shopController.postCart);
// router.get('/cart', shopController.getCart);
// router.post('/cart-delete-item', shopController.postDeleteItem);
// router.post('/create-order', shopController.postOrder);
// router.get('/orders', shopController.getOrders);

module.exports = router;
