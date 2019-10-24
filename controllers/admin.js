const { validationResult } = require('express-validator');
const Product = require('../models/product');
const renderError = require('../helpers/render-error');

// TODO: improve this with Object.assign & possibly other functions
const renderEdit = (res, product, editing, errors, status = 200) => {
  res.status(status).render('admin/edit-product', {
    pageTitle: (editing ? 'Edit Product' : 'Add Product'),
    path: `/admin/${editing ? 'edit' : 'add'}-product`,
    product,
    editing,
    errors,
  });
};

exports.getAddProduct = (req, res) => renderEdit(res, {}, false, []);

exports.postAddProduct = (req, res, next) => {
  const product = { userId: req.user };
  ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
    product[prop] = req.body[prop];
  });
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return renderEdit(res, product, false, errors, 422);
  }
  return new Product(product).save()
    .then(() => res.redirect('/'))
    .catch((err) => renderError(err, next));
};

exports.getProducts = (req, res, next) => Product
  .find({ userId: req.user })
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/admin/products',
    });
  })
  .catch((err) => renderError(err, next));

exports.getEditProduct = (req, res, next) => Product
  .findById(req.params.productId)
  .then((product) => {
    if (!product) {
      return renderError({
        errmsg: 'Product could not be retrieved from the database. Please try again.',
      }, next);
    }
    return renderEdit(res, product, true, []);
  })
  .catch((err) => renderError(err, next));

exports.postEditProduct = (req, res, next) => Product
  .findById(req.body._id)
  .then((product) => {
    if (product.userId.toString() === req.user._id.toString()) {
      const updatedProduct = product;
      ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
        updatedProduct[prop] = req.body[prop];
      });
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return renderEdit(res, updatedProduct, true, errors, 422);
      }
      return updatedProduct.save()
        .then(() => res.redirect('/admin/products'))
        .catch((err) => renderError(err, next));
    }
    return renderError({
      errmsg: 'Attempt to edit product not owned by user',
    }, next);
  })
  .catch((err) => renderError(err, next));


exports.postDeleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.body._id, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => renderError(err, next));
};
