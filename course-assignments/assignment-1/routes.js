const greeting = (res) => {
  res.write('<html>')
  res.write('<head><title>Userz</title></head>')
  res.write('<body>')
  res.write('<h1>Welcome to the Userz page!</h1>')
  res.write('<form action="/create-user" method="POST">')
  res.write('<input type="text" name="username">')
  res.write('<button type="submit">Send</button>')
  res.write('</form>')
  res.write('</body>')
  res.write('</html>')
  res.end()
}

const users = (res) => {
  res.write('<html>')
  res.write('<head><title>See our Userz</title></head>')
  res.write('<body>')
  res.write('<h1>See here all our Userzzz</h1>')
  res.write('<ul>')
  res.write('<li>User 1</li>')
  res.write('<li>The Second User</li>')
  res.write('<li>III. Nutzer</li>')
  res.write('</ul>')
  res.write('</body>')
  res.write('</html>')
  res.end()
}

const parseUser = (req, res) => {
  const body = []
  req.on('data', (chunk) => body.push(chunk))
  req.on('end', () => {
    console.log(Buffer.concat(body).toString())
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()
  })
}

const notFound = (res) => {
  res.statusCode = 404
  res.write('<html><head><title>Page Not Found</title></head><body><h1>404: Page Not Found</h1></body></html>')
  res.end()
}

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method
  res.setHeader('Content-Type', 'text/html')

  if (url === '/') {
    greeting(res)
  } else if (url === '/users') {
    users(res)
  } else if (url === '/create-user' && method === 'POST') {
    parseUser(req, res)
  } else {
    notFound(res)
  }
}

module.exports = requestHandler
