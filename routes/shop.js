const express = require('express')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
  // fetch data from adminData and inject it into view
  const products = adminData.products
  res.render('shop', { prods: products, docTitle: 'Shop' })
})

module.exports = router
