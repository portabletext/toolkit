import path from 'path'
import {defineConfig} from 'vite'
import dts from '@rexxars/vite-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      name: 'portable-text-toolkit',
      fileName: (format) => {
        const ext = format === 'es' ? 'mjs' : 'js'
        return `portable-text-toolkit.${ext}`
      },
    },
    rollupOptions: {
      output: {
        // Since we publish our ./src folder, there's no point in bloating sourcemaps with another copy of it.
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
  },
  plugins: [dts()],
})
