import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagesApiPlugin } from './vite-plugin-images-api.js'

// GitHub Pages project site: https://hafieyz96.github.io/majlis-aqiqah-naura/
export default defineConfig({
  plugins: [react(), imagesApiPlugin()],
  base: '/majlis-aqiqah-naura/',
})
