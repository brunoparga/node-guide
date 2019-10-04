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
  const prodId = req.params.productId;
  Product
    .findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let quantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(([product]) => {
      if (product) {
        quantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => fetchedCart.addProduct(product, { through: { quantity } }))
    .then(() => res.redirect('/cart'));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart
      .getProducts()
      .then((products) => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your cart',
          products,
        });
      }));
};

exports.postDeleteItem = (req, res) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then(([product]) => product.cartItem.destroy())
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
