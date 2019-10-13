const Product = require('../models/product');

exports.getIndex = (_req, res) => {
  Product
    .fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        path: '/',
      });
    });
};

exports.getProducts = (_req, res) => {
  Product
    .fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
      });
    });
};

exports.getProduct = (req, res) => {
  Product
    .findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    });
};

exports.postCart = (req, res) => {
  Product
    .findById(req.body.productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products,
      });
    });
};

exports.postDeleteItem = (req, res) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          const productsWithQuantities = products.map((product) => {
            const newProduct = product;
            newProduct.orderItem = { quantity: product.cartItem.quantity };
            return newProduct;
          });
          return order.addProducts(productsWithQuantities);
        });
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect('/orders'));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders,
      });
    });
};
