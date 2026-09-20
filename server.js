const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const port = Number(process.env.PORT || 3000)
const root = __dirname
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0])
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '')
  const filePath = path.resolve(root, relativePath)

  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.stat(filePath, (error, stats) => {
    const fallbackPath = path.extname(filePath) ? null : `${filePath}.html`
    const targetPath = !error && stats.isFile() ? filePath : fallbackPath

    if (!targetPath) {
      response.writeHead(404)
      response.end('Not found')
      return
    }

    fs.readFile(targetPath, (readError, content) => {
      if (readError) {
        response.writeHead(404)
        response.end('Not found')
        return
      }

      response.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(targetPath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      })
      response.end(content)
    })
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`BdPrompts preview running on port ${port}`)
})
