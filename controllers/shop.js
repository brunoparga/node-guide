const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        path: '/',
        isAuthenticated: req.user,
      });
    });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
        isAuthenticated: req.user,
      });
    });
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.user,
      });
    });
};

exports.postCart = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

exports.getCart = (req, res) => {
  req.user.populate('cart.items.productId').execPopulate()
    .then((user) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products: user.cart.items,
        isAuthenticated: req.user,
      });
    });
};

exports.postDeleteItem = (req, res) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'));
};

exports.postOrder = (req, res) => {
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
    .then(() => res.redirect('/orders'));
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders,
        isAuthenticated: req.user,
      });
    });
};
