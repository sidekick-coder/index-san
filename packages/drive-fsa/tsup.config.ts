import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
    entry: ['index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
})
