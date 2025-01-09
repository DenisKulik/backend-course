const http = require('http')
const path = require('path')
const fs = require('fs')

let requests = 0

const server = http.createServer((req, res) => {
  requests++

  switch (req.url) {
    case '/':
      res.write('home')
      break
    case '/about':
      res.write('about')
      break
    case '/icon.png':
      const iconPath = path.join(__dirname, 'icon.png')
      fs.readFile(iconPath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('Icon not found')
        } else {
          res.writeHead(200, { 'Content-Type': 'image/png' })
          res.end(data)
        }
      })
      return
    default:
      res.write('404')
  }

  res.write(`\nrequests: ${requests}`)
  res.end()
})

server.listen(3003)