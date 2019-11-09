require('dotenv').config();
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const Product = require('../models/product');
const Order = require('../models/order');
const renderError = require('../services/render-error');

const ITEMS_PER_PAGE = 3;

const calculatePages = (productCount, currentPage) => ({
  productCount,
  currentPage,
  hasNextPage: (ITEMS_PER_PAGE * currentPage < productCount),
  hasPreviousPage: (currentPage > 1),
  nextPage: (currentPage + 1),
  previousPage: (currentPage - 1),
  lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
});

const calculateTotal = (products) => products.reduce((subtotal, prod) => (
  subtotal + (prod.quantity * prod.productId.price)
), 0);

exports.getIndex = async (req, res, next) => {
  try {
    const productCount = await Product.find().countDocuments();
    const product = await Product.findOne();
    res.render('shop/index', {
      product,
      productCount,
      pageTitle: 'SuperDuperStore',
      path: '/',
    });
  } catch (err) {
    renderError(err, next);
  }
};

exports.getProducts = async (req, res, next) => {
  const currentPage = Number.parseInt(req.query.page, 10) || 1;
  try {
    const productCount = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.render('shop/product-list', {
      ...calculatePages(productCount, currentPage),
      products,
      pageTitle: 'Shop',
      path: '/products',
    });
  } catch (err) {
    renderError(err, next);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (err) {
    renderError(err, next);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (err) {
    renderError(err, next);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your cart',
      products: user.cart.items,
    });
  } catch (err) {
    renderError(err, next);
  }
};

exports.postRemoveFromCart = async (req, res, next) => {
  try {
    await req.user.removeFromCart(req.body.productId);
    res.redirect('/cart');
  } catch (err) {
    renderError(err, next);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items;
    const lineItems = products.map((p) => ({
      name: p.productId.title,
      description: p.productId.description,
      amount: p.productId.price * 100,
      currency: 'usd',
      quantity: p.quantity,
    }));
    const localhost = 'http://localhost:3000';
    const production = 'https://superduperstore.herokuapp.com';
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NODE_ENV === 'production' ? production : localhost}/checkout/success`,
      cancel_url: `${process.env.NODE_ENV === 'production' ? production : localhost}/checkout/cancel`,
    });
    const total = calculateTotal(products);
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products,
      total,
      sessionId: stripeSession.id,
    });
  } catch (err) {
    renderError(err, next);
  }
};

const createOrder = (user) => {
  const products = user.cart.items.map((product) => ({
    quantity: product.quantity,
    product: { ...product.productId._doc },
  }));
  const total = calculateTotal(products);
  return new Order({
    user: {
      email: user.email,
      userId: user,
    },
    products,
    total,
  });
};

exports.getCheckoutSuccess = async (req, res, next) => {
  // TODO: verify that user has really just placed an order
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    await createOrder(user).save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    renderError(err, next);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your orders',
      orders,
    });
  } catch (err) {
    renderError(err, next);
  }
};

const setCents = (value) => parseFloat(value).toFixed(2);

const addProductsToPDF = (order, pdfDoc) => {
  order.products.forEach((product) => {
    const { title, price } = product.product;
    const subtotal = product.quantity * price;
    pdfDoc.text(`${title}: ${product.quantity} x $${setCents(price)} = $${setCents(subtotal)}`);
  });
  pdfDoc.text(`\nTOTAL: $${setCents(order.total)}`);
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

const preSendInvoice = (order, req, res, next) => {
  if (!order) {
    next(new Error('Order not found.'));
  } else if (order.user.userId.toString() !== req.user._id.toString()) {
    next(new Error('Unauthorized user.'));
  } else {
    sendInvoice(order, req, res);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    preSendInvoice(order, req, res, next);
  } catch (err) {
    renderError(err, next);
  }
};
