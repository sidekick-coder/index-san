const { resolve } = require('path')
const { mergeConfig } = require('vite')

const baseConfig = require('./vite.base.config')


module.exports = mergeConfig(baseConfig, {
    build: {
        lib: {
            entry: resolve(__dirname, 'app.ts'),
            name: 'App',
        },
    },
})

