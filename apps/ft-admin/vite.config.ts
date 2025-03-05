import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
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
})
