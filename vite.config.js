import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Bootstrap 5.3 still uses @import and global Sass functions; silence those
// upstream deprecation warnings until Bootstrap moves to the module system.
const SASS_SILENCED = ['import', 'global-builtin', 'color-functions', 'mixed-decls']

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The API server sends no CORS headers, so in dev the browser calls /api on this
  // server and Vite forwards it to API_PROXY_TARGET (see .env.example).
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, 'node_modules')],
          quietDeps: true,
          silenceDeprecations: SASS_SILENCED,
        },
      },
    },
    server: {
      host: true,
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:8080',
          // Keep the browser's Host header: the API's CSRF check (Go CrossOriginProtection)
          // compares Origin with Host, so rewriting Host makes every POST/PUT/DELETE fail with 403.
          changeOrigin: false,
        },
      },
    },
  }
})
