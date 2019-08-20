const fs = require('fs')

const displayForm = (res) => {
  res.write('<html>')
  res.write('<head><title>Enter Message</title></head>')
  res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
  res.write('</html>')
  return res.end()
}

const writeSuccess = (res) => {
  res.statusCode = 302
  res.setHeader('Location', '/')
  return res.end()
}

const writeFail = (res) => {
  res.statusCode = 500
  res.setHeader('Location', '/')
  return res.end()
}

const writeMessage = (body, res) => {
  const parsedBody = Buffer.concat(body).toString()
  const message = parsedBody.split('=')[1]
  return fs.writeFile('message.txt', message, err => {
    return (err ? writeFail(res) : writeSuccess(res))
  })
}

const parseMessage = (req, res) => {
  const body = []
  req.on('data', (chunk) => body.push(chunk))
  return req.on('end', () => writeMessage(body, res))
}

const defaultPage = (res) => {
  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<head><title>My First Page</title></head>')
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
  res.write('</html>')
  return res.end()
}

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method

  if (url === '/') {
    return displayForm(res)
  } else if (url === '/message' && method === 'POST') {
    return parseMessage(req, res)
  }
  return defaultPage(res)
}

module.exports = requestHandler
