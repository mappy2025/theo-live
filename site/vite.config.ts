import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Dev-only: serve ../feed/*.json at /feed so the dashboard reads the local
// feed before it is pushed. In production the site fetches the feed from the
// repo's raw GitHub URL (see src/config.ts).
function localFeed(): Plugin {
  const feedDir = path.resolve(__dirname, '..', 'feed')
  return {
    name: 'local-feed',
    configureServer(server) {
      server.middlewares.use('/feed', (req, res, next) => {
        const rel = (req.url || '').split('?')[0].replace(/^\/+/, '')
        const file = path.join(feedDir, rel)
        if (file.startsWith(feedDir) && fs.existsSync(file) && fs.statSync(file).isFile()) {
          res.setHeader('Content-Type', 'application/json')
          fs.createReadStream(file).pipe(res)
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localFeed()],
})
