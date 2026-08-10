import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const IMAGES_ROOT = path.resolve(process.cwd(), 'public', 'images')
const MANIFEST_PATH = path.join(IMAGES_ROOT, 'manifest.json')

type FolderMap = Record<string, string[]>

function ensureImagesRoot() {
  fs.mkdirSync(IMAGES_ROOT, { recursive: true })
}

function safeResolve(relativeFolder: string, filename = ''): string | null {
  const cleaned = relativeFolder.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
  if (filename) {
    const parts = cleaned ? cleaned.split('/').filter(Boolean) : []
    if (parts.some((p) => p === '..' || p === '.')) return null
    const base = path.basename(filename)
    if (!base || base.includes('..')) return null
    const full = path.resolve(IMAGES_ROOT, ...parts, base)
    if (!full.startsWith(IMAGES_ROOT + path.sep)) return null
    return full
  }
  if (!cleaned || cleaned.includes('..') || path.isAbsolute(cleaned)) return null
  const parts = cleaned.split('/').filter(Boolean)
  if (parts.some((p) => p === '..' || p === '.')) return null
  const full = path.resolve(IMAGES_ROOT, ...parts)
  if (!full.startsWith(IMAGES_ROOT + path.sep) && full !== IMAGES_ROOT) return null
  return full
}

function publicPathFor(absFile: string): string {
  const rel = path.relative(path.join(process.cwd(), 'public'), absFile).replace(/\\/g, '/')
  return `/${rel}`
}

function scanFolders(): FolderMap {
  ensureImagesRoot()
  const map: FolderMap = {}

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const relDir = path.relative(IMAGES_ROOT, dir).replace(/\\/g, '/')

    for (const entry of entries) {
      if (entry.name === 'manifest.json') continue
      const abs = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(abs)
      } else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) {
        const folderKey = relDir || '_root'
        map[folderKey] ??= []
        map[folderKey].push(publicPathFor(abs))
      }
    }
  }

  walk(IMAGES_ROOT)

  for (const name of ['hero', 'card', 'gallery', 'stickers']) {
    const dir = path.join(IMAGES_ROOT, name)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    map[name] ??= []
  }

  for (const key of Object.keys(map)) {
    map[key].sort()
  }
  return map
}

function writeManifest(map: FolderMap) {
  const payload = {
    hero: map.hero ?? [],
    card: map.card ?? [],
    gallery: map.gallery ?? [],
    stickers: map.stickers ?? [],
    folders: Object.keys(map).sort(),
    files: map,
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(payload, null, 2), 'utf8')
}

function readBody(req: {
  on: (event: string, cb: (arg?: Buffer) => void) => void
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => {
      if (c) chunks.push(Buffer.from(c))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', () => reject(new Error('Gagal baca request')))
  })
}

function sendJson(
  res: {
    statusCode: number
    setHeader: (k: string, v: string) => void
    end: (s: string) => void
  },
  status: number,
  data: unknown,
) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function imagesApiPlugin(): Plugin {
  return {
    name: 'images-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/api/images')) return next()

        try {
          if (req.method === 'GET' && url === '/api/images') {
            const files = scanFolders()
            writeManifest(files)
            return sendJson(res, 200, {
              writable: true,
              folders: Object.keys(files).sort(),
              files,
            })
          }

          if (req.method === 'POST' && url === '/api/images/mkdir') {
            const body = JSON.parse(await readBody(req)) as { folder?: string }
            const folder = (body.folder ?? '').trim()
            const target = safeResolve(folder)
            if (!target) return sendJson(res, 400, { error: 'Folder tidak sah' })
            fs.mkdirSync(target, { recursive: true })
            const files = scanFolders()
            writeManifest(files)
            return sendJson(res, 200, { ok: true, folder, files })
          }

          if (req.method === 'POST' && url === '/api/images/upload') {
            const body = JSON.parse(await readBody(req)) as {
              folder?: string
              filename?: string
              dataBase64?: string
            }
            const folder = (body.folder ?? '').trim()
            const filename = path.basename(body.filename ?? 'upload.jpg')
            if (!body.dataBase64) {
              return sendJson(res, 400, { error: 'Tiada data imej' })
            }
            const target = safeResolve(folder, filename)
            if (!target) return sendJson(res, 400, { error: 'Laluan tidak sah' })
            fs.mkdirSync(path.dirname(target), { recursive: true })
            fs.writeFileSync(target, Buffer.from(body.dataBase64, 'base64'))
            const publicPath = publicPathFor(target)
            const files = scanFolders()
            writeManifest(files)
            return sendJson(res, 200, { ok: true, path: publicPath, files })
          }

          if (req.method === 'DELETE' && url === '/api/images') {
            const body = JSON.parse(await readBody(req)) as { path?: string }
            const pub = (body.path ?? '').replace(/^\/+/, '')
            if (!pub.startsWith('images/')) {
              return sendJson(res, 400, { error: 'Laluan tidak sah' })
            }
            const rel = pub.slice('images/'.length)
            const parts = rel.split('/').filter(Boolean)
            const file = parts.pop()
            if (!file) return sendJson(res, 400, { error: 'Laluan tidak sah' })
            const abs = safeResolve(parts.join('/'), file)
            if (!abs || !fs.existsSync(abs)) {
              return sendJson(res, 404, { error: 'Fail tidak dijumpai' })
            }
            fs.unlinkSync(abs)
            const files = scanFolders()
            writeManifest(files)
            return sendJson(res, 200, { ok: true, files })
          }

          return sendJson(res, 404, { error: 'Endpoint tidak dijumpai' })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Ralat pelayan'
          return sendJson(res, 500, { error: message })
        }
      })
    },
  }
}
