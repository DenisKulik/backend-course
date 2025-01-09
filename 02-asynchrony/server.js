const http = require('http')
const path = require('path')
const fs = require('fs')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => err ? reject(err) : resolve(data))
    })
}

const server = http.createServer(async (req, res) => {
    switch (req.url) {
        case '/home':
            try {
                const homePage = await readFile(path.join(__dirname, 'pages', 'home.html'))
                res.write(homePage)
                res.end()
            } catch (err) {
                res.write(err.message)
                res.end()
            }
            break
        case '/about':
            await delay(3000)
            res.write('about')
            res.end()
            break
        default:
            res.write('404')
            res.end()
    }

})

server.listen(3003)