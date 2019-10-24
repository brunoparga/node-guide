const Product = require('../models/product');
const Order = require('../models/order');
const renderError = require('../helpers/render-error');

exports.getIndex = (_req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        path: '/',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.getProducts = (_req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch((err) => renderError(err, next));
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId').execPopulate()
    .then((user) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products: user.cart.items,
      });
    })
    .catch((err) => renderError(err, next));
};

exports.postDeleteItem = (req, res, next) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch((err) => renderError(err, next));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId').execPopulate()
    .then((user) => {
      const order = new Order({
        user: { ...user._doc, userId: user._id },
        products: user.cart.items
          .map((item) => ({
            product: { ...item.productId._doc },
            quantity: item.quantity,
          })),
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch((err) => renderError(err, next));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders,
      });
    })
    .catch((err) => renderError(err, next));
};
