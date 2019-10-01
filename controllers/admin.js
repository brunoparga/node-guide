const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  req.user
    .createProduct(req.body)
    .then(() => {
      res.redirect('/');
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  return Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    });
};

exports.postEditProduct = (req, res) => {
  Product.update(req.body, { where: { id: req.body.id } });
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  Product.destroy({ where: { id: req.body.id } });
  res.redirect('/admin/products');
};

exports.getProducts = (_req, res) => {
  Product
    .findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products',
      });
    });
};
