const { resolve } = require('path')
const { readFileSync } = require('fs')

const tsConfigPaths = require('tsconfig-paths')

const filename = resolve(__dirname, '../tsconfig.json')

const tsConfig = JSON.parse(readFileSync(filename, 'utf8'))

require('ts-node').register({
  transpileOnly: true,
  project: require('path').resolve(__dirname, '..', 'tsconfig.json'),
})

tsConfigPaths.register({
  baseUrl: require('path').resolve(__dirname, '..'),
  paths: tsConfig.compilerOptions.paths,
})
