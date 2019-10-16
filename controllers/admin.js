const Product = require('../models/product');

exports.getAddProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const productData = {};
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

exports.getProducts = (req, res) => {
  Product
    .fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products',
      });
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  return Product.findById(prodId)
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
  const {
    title,
    imageURL,
    price,
    description,
    _id,
  } = req.body;
  new Product(title, imageURL, price, description, _id).save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteById(req.body._id);
  res.redirect('/admin/products');
};
