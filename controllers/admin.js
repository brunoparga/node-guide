const Product = require('../models/product');

exports.getAddProduct = (_req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const {
    title,
    imageURL,
    price,
    description,
  } = req.body;
  const product = new Product(title, imageURL, price, description);
  product.save()
    .then(() => {
      res.redirect('/');
    });
};

// exports.getEditProduct = (req, res) => {
//   const editMode = req.query.edit === 'true';
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   return req.user.getProducts({ where: { id: prodId } })
//     .then(([product]) => {
//       if (!product) {
//         return res.redirect('/');
//       }
//       return res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product,
//       });
//     });
// };

// exports.postEditProduct = (req, res) => {
//   Product.update(req.body, { where: { id: req.body.id } });
//   res.redirect('/admin/products');
// };

// exports.postDeleteProduct = (req, res) => {
//   Product.destroy({ where: { id: req.body.id } });
//   res.redirect('/admin/products');
// };

// exports.getProducts = (req, res) => {
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/admin/products',
//       });
//     });
// };
