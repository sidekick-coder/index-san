import { defineConfig } from 'tsup'
import path from 'path'
import fg from 'fast-glob'
import fs from 'fs/promises'

const files = fg.sync(['src/**/*.ts']).filter((f) => !/(bin|__tests__|spec|.d.ts)/.test(f))

export default defineConfig({
    entry: files,
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    onSuccess: async () => {
        const filename = path.resolve(__dirname, 'dist', 'index.js')
        const content = files
            .map((f) => `export * from './${f.replace('src/', '').replace('.ts', '')}'`)
            .join('\n')

        await fs.writeFile(filename, content)
    },
})
