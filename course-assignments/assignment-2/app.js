// Core Node modules
// Third-party packages
const express = require('express')

// My own requires
// Module
const app = express()

app.use((req, res, next) => {
  console.log('F1RST')
  next()
})

app.use('/users', (req, res, next) => {
  console.log(next)
  res.send('<ul><li>User1</li><li>User2</li></ul>')
})

app.use('/', (req, res, next) => {
  console.log('FIRST oh wait')
  res.send('<h1>HELLO WORLD!!1!eleven!</h1>')
})

app.listen(3000)
