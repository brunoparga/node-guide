const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const renderError = require('../helpers/render-error');

exports.getIndex = (_req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        path: '/',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.getProducts = (_req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => renderError(err, next));
};

exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch((err) => renderError(err, next));
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId').execPopulate()
    .then((user) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products: user.cart.items,
      });
    })
    .catch((err) => renderError(err, next));
};

exports.postDeleteItem = (req, res, next) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch((err) => renderError(err, next));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId').execPopulate()
    .then((user) => {
      const order = new Order({
        user: { ...user._doc, userId: user._id },
        products: user.cart.items
          .map((item) => ({
            product: { ...item.productId._doc },
            quantity: item.quantity,
          })),
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch((err) => renderError(err, next));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders,
      });
    })
    .catch((err) => renderError(err, next));
};

const addProductsToPDF = (order, pdfDoc) => {
  let total = 0;
  order.products.forEach((product) => {
    const { title, price } = product.product;
    const subtotal = product.quantity * price;
    total += subtotal;
    pdfDoc.text(`${title}: ${product.quantity} x $${price} = ${subtotal}`);
  });
  pdfDoc.text(`\nTOTAL: $${total}`);
  return pdfDoc;
};

const createPDF = (order) => {
  let pdfDoc = new PDFDocument();
  pdfDoc.fontSize(26).text('INVOICE');
  pdfDoc.text('-------------------------------------------').fontSize(14);
  pdfDoc = addProductsToPDF(order, pdfDoc);
  return pdfDoc;
};

const saveInvoice = (pdfDoc, req) => {
  const invoiceName = `invoice-${req.params.orderId}.pdf`;
  const invoicePath = path.join('data', 'invoices', invoiceName);
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.end();
};

const streamInvoice = (pdfDoc, req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${req.params.orderId}"`);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

const sendInvoice = (order, req, res) => {
  const pdfDoc = createPDF(order);
  saveInvoice(pdfDoc, req);
  streamInvoice(pdfDoc, req, res);
};

const validateInvoiceRequest = (order, req, res, next) => {
  if (!order) {
    next(new Error('Order not found.'));
  } else if (order.user.userId.toString() !== req.user._id.toString()) {
    next(new Error('Unauthorized user.'));
  } else {
    sendInvoice(order, req, res);
  }
};

exports.getInvoice = (req, res, next) => {
  Order.findById(req.params.orderId)
    .then((order) => validateInvoiceRequest(order, req, res, next))
    .catch((err) => next(err));
};
