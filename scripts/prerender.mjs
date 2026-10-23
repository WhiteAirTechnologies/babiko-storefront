import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const port = Number(process.env.PRERENDER_PORT || 4178)
const origin = `http://localhost:${port}`

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

async function readRoutes() {
  const sitemap = await readFile(join(distDir, 'sitemap.xml'), 'utf8')
  const routes = []
  for (const match of sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const { pathname } = new URL(match[1])
    if (!routes.includes(pathname)) routes.push(pathname)
  }
  return routes
}

function startServer() {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, origin).pathname)
    let filePath = resolve(distDir, `.${pathname}`)

    if (!filePath.startsWith(distDir)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html')
    if (!existsSync(filePath)) filePath = join(distDir, 'index.html')

    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream' })
    createReadStream(filePath).pipe(response)
  })

  return new Promise((ready, failed) => {
    server.on('error', failed)
    server.listen(port, () => ready(server))
  })
}

function outputPathFor(route) {
  if (route === '/') return join(distDir, 'index.html')
  return join(distDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

async function prerender() {
  const routes = await readRoutes()
  if (!routes.length) throw new Error('No <loc> entries found in dist/sitemap.xml')

  console.log(`Prerendering ${routes.length} routes…`)

  const server = await startServer()
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const pages = []

  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 900 })

      await page.setRequestInterception(true)
      page.on('request', request => {
        const type = request.resourceType()
        if (type === 'image' || type === 'font' || type === 'media') request.abort()
        else request.continue()
      })

      await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForFunction(
        expected => document.documentElement.getAttribute('data-seo-path') === expected,
        { timeout: 30000 },
        route
      )

      const html = await page.content()
      await page.close()

      pages.push({
        route,
        outPath: outputPathFor(route),
        html: html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
      })
    }
  } finally {
    await browser.close()
    await new Promise(done => server.close(done))
  }

  for (const { route, outPath, html } of pages) {
    await mkdir(dirname(outPath), { recursive: true })
    await writeFile(outPath, html)
    console.log(`  ${route} → ${outPath.slice(rootDir.length + 1)}`)
  }

  console.log(`Prerendered ${pages.length} routes.`)
}

prerender().catch(error => {
  console.error('Prerender failed:', error)
  process.exitCode = 1
})
