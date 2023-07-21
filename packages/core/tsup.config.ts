import { defineConfig } from 'tsup'
import path from 'path'
import fg from 'fast-glob'

const files = fg.sync(['src/**/*.ts']).filter((f) => !/(spec)/.test(f))

export default defineConfig({
    entry: files,
    clean: true,
    dts: true,
    splitting: false,
    sourcemap: false,
    bundle: false,
    minify: false,
    format: ['esm', 'cjs'],
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
})
