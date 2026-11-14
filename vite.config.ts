import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin, type Connect } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function permanentStoragePlugin(): Plugin {
  const dbDir = path.resolve(__dirname, 'server_storage')
  const dbFile = path.resolve(dbDir, 'permanent_sales_db.json')
  const backupDir = path.resolve(dbDir, 'backups')

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const storageMiddleware: Connect.NextHandleFunction = (req, res, next) => {
    // GET /api/storage/load -> Returns disk database
    if (req.url === '/api/storage/load' && req.method === 'GET') {
      if (fs.existsSync(dbFile)) {
        try {
          const data = fs.readFileSync(dbFile, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
          return
        } catch (err: any) {
          console.error('Error reading permanent_sales_db.json:', err)
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ exists: false }))
      return
    }

    // POST /api/storage/save -> Permanently saves to disk + automated timestamped backup
    if (req.url === '/api/storage/save' && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          parsed.lastUpdated = new Date().toISOString()
          const avatarMap: Record<string, string> = {
            yazhini: '/avatars/yazhini.png',
            naveena: '/avatars/naveena.png',
            janani: '/avatars/janani.jpg',
          }
          if (parsed.reps && Array.isArray(parsed.reps)) {
            parsed.reps = parsed.reps.map((r: any) => ({
              ...r,
              avatarUrl: r.avatarUrl || avatarMap[r.id?.toLowerCase()] || avatarMap[r.name?.toLowerCase()]
            }))
          }

          // 1. Write to permanent master file
          fs.writeFileSync(dbFile, JSON.stringify(parsed, null, 2), 'utf-8')

          // 2. Write rolling backup
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const backupFile = path.resolve(backupDir, `backup_${timestamp}.json`)
          fs.writeFileSync(backupFile, JSON.stringify(parsed, null, 2), 'utf-8')

          // Clean up older than 30 backups
          const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
            .sort()
          if (files.length > 30) {
            files.slice(0, files.length - 30).forEach(f => {
              try { fs.unlinkSync(path.resolve(backupDir, f)) } catch (_) {}
            })
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, count: parsed.sales?.length || 0, savedAt: parsed.lastUpdated }))
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
      return
    }

    next()
  }

  return {
    name: 'permanent-sales-storage',
    configureServer(server) {
      server.middlewares.use(storageMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(storageMiddleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    permanentStoragePlugin(),
  ],
  server: {
    allowedHosts: true,
    watch: {
      ignored: ['**/server_storage/**', '**/data/**'],
    },
  },
  preview: {
    allowedHosts: true,
    port: 5173,
    strictPort: true,
  },
})
