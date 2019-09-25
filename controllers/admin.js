const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
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
  const prodId = req.params.productId;
  return Product.findById(prodId, (product) => {
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

exports.getProducts = (_req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
    });
  });
};
