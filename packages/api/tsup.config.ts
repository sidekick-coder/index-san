import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['server.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
})
