const path = require('path')
const tailwindcss = require('tailwindcss')

const { defineConfig, mergeConfig } = require('vite')

const baseConfig = require('../vite.base.config')


module.exports = mergeConfig(baseConfig, {
    build: {
        lib: {
            entry: path.resolve(__dirname, 'app.ts'),
            name: 'App',
        },
    },
})

