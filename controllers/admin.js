const Product = require('../models/product');

exports.getAddProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res) => {
  const {
    title, imageURL, description, price,
  } = req.body;

  const product = new Product(title, imageURL, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
  });
};

exports.getProducts = (_req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
    });
  });
};
