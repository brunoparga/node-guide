const path = require('path')
const express = require('express')
const rootDir = require('../helpers/path')

const router = express.Router()

const products = []

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})
router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title }) // for the moment, this could
  // be just req.body
  res.redirect('/')
})

exports.routes = router
exports.products = products
