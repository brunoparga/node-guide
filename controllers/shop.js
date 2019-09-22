const Product = require('../models/product');

exports.getIndex = (_req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
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

exports.getCart = (_req, res) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your cart',
  });
};

exports.getCheckout = (_req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Check out',
  });
};
