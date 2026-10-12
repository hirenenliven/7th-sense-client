import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Bootstrap 5.3 still uses @import and global Sass functions; silence those
// upstream deprecation warnings until Bootstrap moves to the module system.
const SASS_SILENCED = ['import', 'global-builtin', 'color-functions', 'mixed-decls']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(import.meta.dirname, 'node_modules')],
        quietDeps: true,
        silenceDeprecations: SASS_SILENCED,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
