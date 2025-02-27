import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  if (options?.env?.NODE_ENV === 'development') {
    return {
      entry: ['src/app.ts'],
      splitting: true,
      sourcemap: true,
      clean: true,
      dts: false,
      format: ['esm'],
      watch: true,
      onSuccess: 'node dist/app.js --enable-source-maps',
    }
  }
  return {
    entry: ['src/app.ts'],
    splitting: true,
    sourcemap: true,
    clean: true,
    dts: false,
    format: ['esm'],
    watch: false,
  }
})
