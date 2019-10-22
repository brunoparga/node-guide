const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = { userId: req.user };
  ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
    product[prop] = req.body[prop];
  });
  new Product(product)
    .save()
    .then(() => {
      res.redirect('/');
    });
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
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product,
    });
  });

exports.postEditProduct = (req, res) => Product
  .findById(req.body._id)
  .then((product) => {
    if (product.userId.toString() === req.user._id.toString()) {
      const updatedProduct = product;
      ['title', 'imageURL', 'price', 'description'].forEach((prop) => {
        updatedProduct[prop] = req.body[prop];
      });
      updatedProduct.save()
        .then(() => res.redirect('/admin/products'));
    } else {
      res.redirect('/');
    }
  });

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.body._id, userId: req.user._id })
    .then(() => res.redirect('/admin/products'));
};
