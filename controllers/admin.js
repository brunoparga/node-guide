const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.loggedIn,
  });
};

exports.postAddProduct = (req, res) => {
  const productData = { userId: req.user };
  ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
    productData[prop] = req.body[prop];
  });
  const product = new Product(productData);
  product
    .save()
    .then(() => {
      res.redirect('/');
    });
};

exports.getProducts = (req, res) => Product
  .find()
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
      isAuthenticated: req.session.loggedIn,
    });
  });

exports.getEditProduct = (req, res) => Product
  .findById(req.params.productId)
  .then((product) => {
    if (!product) {
      return res.redirect('/');
    }
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product,
      isAuthenticated: req.session.loggedIn,
    });
  });

exports.postEditProduct = (req, res) => {
  const updatedProduct = {};
  ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
    updatedProduct[prop] = req.body[prop];
  });
  Product
    .findByIdAndUpdate(req.body._id, updatedProduct)
    .then(() => res.redirect('/admin/products'));
};

exports.postDeleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.body._id)
    .then(() => res.redirect('/admin/products'));
};
