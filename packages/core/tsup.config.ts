import { defineConfig } from 'tsup'
import path from 'path'
import fg from 'fast-glob'

const files = fg.sync(['src/**/*.ts']).filter((f) => !/(spec)/.test(f))

export default defineConfig({
    entry: files,
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
})
