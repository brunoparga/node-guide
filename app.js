// IMPORTS SECTION
// Node core module to deal with file paths
const path = require('path')

// NPM packages
// The express.js framework
const express = require('express')
// Parses the body of a POST request
const bodyParser = require('body-parser')

// =================
// =================

// Main app object
const app = express()
app.set('view engine', 'ejs')
// Configure views folder (not needed, as this is the default)
app.set('views', 'views')

// App routes have been segregated into different files
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// All middleware functions

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }))
// Serve static files, like CSS and browser JS
app.use(express.static(path.join(__dirname, 'public')))
// Prepend a path to these routes
app.use('/admin', adminData.routes)
// But not these
app.use(shopRoutes)
// Fall back to sending a 404
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' })
})

// App listens on port 3000
app.listen(3000)
