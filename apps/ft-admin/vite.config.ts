import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import Unocss from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import VueRouter from 'unplugin-vue-router/vite'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [VueRouter({
    exclude: ['src/pages/**/components/**'],
  }), vue(), Unocss(), Icons()],
  resolve: {
    alias: {
      // '@': '/src',   will be work, but not confirm
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('defaults and fully supports es6-module')),
    },
  },
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },
    sourcemap: true,
  },
})
