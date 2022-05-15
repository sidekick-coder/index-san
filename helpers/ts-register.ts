const { resolve } = require('path')
const { readFileSync } = require('fs')

const tsConfigPaths = require('tsconfig-paths')

const root = process.cwd()
const filename = resolve(root, 'tsconfig.json')

const tsConfig = JSON.parse(readFileSync(filename, 'utf8'))

require('ts-node').register({
  transpileOnly: true,
  project: filename,
})

tsConfigPaths.register({
  baseUrl: root,
  paths: tsConfig.compilerOptions.paths,
})
