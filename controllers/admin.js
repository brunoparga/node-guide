const { validationResult } = require('express-validator');
const Product = require('../models/product');
const renderError = require('../helpers/render-error');
const deleteFile = require('../helpers/delete-file');

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

const setProduct = (product, req) => {
  const result = product;
  ['title', 'price', 'description'].forEach((prop) => {
    result[prop] = req.body[prop];
  });
  return result;
};

const editProduct = async (req, res, product) => {
  const updatedProduct = setProduct(product, req);
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    renderEdit(res, updatedProduct, true, errors, 422);
  } else {
    // Only delete existing image if a new one was provided
    if (req.file) {
      deleteFile(product.imageURL);
      updatedProduct.imageURL = req.file.path;
    }
    await updatedProduct.save();
    res.redirect('/admin/products');
  }
};

exports.getAddProduct = (req, res) => renderEdit(res, {}, false, []);

exports.postAddProduct = async (req, res, next) => {
  const product = setProduct({ userId: req.user }, req);
  const errors = validationResult(req).array();
  if (!req.file) {
    errors.push({ msg: 'Attached file is not an image.' });
  }
  if (errors.length > 0) {
    renderEdit(res, product, false, errors, 422);
  } else {
    product.imageURL = req.file.path;
    try {
      await new Product(product).save();
      res.redirect('/');
    } catch (err) {
      renderError(err, next);
    }
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user });
    res.render('admin/products', {
      products,
      pageTitle: 'Shop',
      path: '/admin/products',
    });
  } catch (err) {
    renderError(err, next);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      renderEdit(res, product, true, []);
    } else {
      renderError({
        errmsg: 'Product could not be retrieved from the database. Please try again.',
      }, next);
    }
  } catch (err) {
    renderError(err, next);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body._id);
    if (product.userId.toString() === req.user._id.toString()) {
      editProduct(req, res, product);
    } else {
      renderError({ errmsg: 'Attempt to edit product not owned by user' }, next);
    }
  } catch (err) {
    renderError(err, next);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params._id, userId: req.user._id });
    if (product) {
      deleteFile(product.imageURL);
      await product.delete();
      res.status(200).json({ message: 'Success!' });
    } else {
      next({ msg: 'Product not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Deleting product failed.' });
  }
};
