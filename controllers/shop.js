const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (_req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Index',
      path: '/',
    });
  });
};

exports.getProducts = (_req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.getCart = (_req, res) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your cart',
  });
};

exports.getOrders = (_req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your orders',
  });
};

exports.getCheckout = (_req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Check out',
  });
};
