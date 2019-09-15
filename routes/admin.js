const express = require('express')

const router = express.Router()

const products = []

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true
  })
})

router.post('/add-product', (req, res, next) => {
  products.push(req.body)
  res.redirect('/')
})

exports.routes = router
exports.products = products
