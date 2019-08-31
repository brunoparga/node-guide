// Requiring core Node.js modules

// Requiring third-party packages
const express = require('express')

// Requiring our own code

// Our code for this module
const app = express()

app.use('/add-product', (req, res, next) => {
  console.log('In another middleware')
  res.send('<h1>The "Add Product" page</h1>')
})

app.use('/', (req, res, next) => {
  console.log('In another middleware')
  res.send('<h1>Hello from Express!</h1>')
})

app.listen(3000)
