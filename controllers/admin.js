const { validationResult } = require('express-validator');
const Product = require('../models/product');

const renderEdit = (res, product, editing, errorMessage, status = 200) => {
  res.status(status).render('admin/edit-product', {
    pageTitle: (editing ? 'Edit Product' : 'Add Product'),
    path: '/admin/edit-product',
    product,
    editing,
    errorMessage,
  });
};

exports.getAddProduct = (req, res) => renderEdit(res, {}, false, '');

exports.postAddProduct = (req, res) => {
  const product = { userId: req.user };
  ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
    product[prop] = req.body[prop];
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderEdit(res, product, false, errors.array()[0].msg, 422);
  }
  return new Product(product).save()
    .then(() => res.redirect('/'));
};

exports.getProducts = (req, res) => Product
  .find({ userId: req.user })
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
    });
  });

exports.getEditProduct = (req, res) => Product
  .findById(req.params.productId)
  .then((product) => {
    if (!product) {
      return res.redirect('/');
    }
    return renderEdit(res, product, true, '');
  });

exports.postEditProduct = (req, res) => Product
  .findById(req.body._id)
  .then((product) => {
    if (product.userId.toString() === req.user._id.toString()) {
      const updatedProduct = product;
      ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
        updatedProduct[prop] = req.body[prop];
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return renderEdit(res, updatedProduct, true, errors.array()[0].msg, 422);
      }
      return updatedProduct.save()
        .then(() => res.redirect('/admin/products'));
    }
    return res.redirect('/');
  });

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.body._id, userId: req.user._id })
    .then(() => res.redirect('/admin/products'));
};
