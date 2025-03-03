import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  if (options?.env?.NODE_ENV === 'development') {
    return {
      entry: ['src/main.ts'],
      splitting: true,
      sourcemap: true,
      clean: true,
      dts: true,
      format: ['esm'],
      watch: true,
    }
  }
  return {
    entry: ['src/main.ts'],
    splitting: true,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['esm'],
    watch: false,
  }
})
