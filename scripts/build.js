// build artifacts

const path = require('path')
const fg = require('fast-glob')
const fs = require('fs')
const { command } = require('./utils')

const BASE_PATH = path.resolve(__dirname, '..')
const packageJSON = require(path.resolve(BASE_PATH, 'package.json'))

async function main() {
    const appPath = path.resolve(BASE_PATH, 'packages', 'electron')
    const outputFolder = path.resolve(BASE_PATH, 'artifacts')

    if (fs.existsSync(outputFolder)) {
        fs.rmSync(outputFolder, { recursive: true })
    }

    fs.mkdirSync(outputFolder, { recursive: true })

    // build core

    await command('npm -w @index-san/core run build')

    // build electron

    await command('npm -w @index-san/electron run build')

    // make app artifacts

    await command('npm -w @index-san/electron run make')

    // moving artifacts

    const pattern = path.resolve(appPath, 'out', 'make', '**/*').split(path.sep).join('/')

    const files = await fg(pattern)

    const entries = files.map((f) => ({
        source: f.split('/').join(path.sep),
        destination: path.resolve(outputFolder, path.basename(f).replace('1.0.0', packageJSON.version)),
    }))


    for await (const entry of entries) {
        await fs.promises.rename(entry.source, entry.destination)
    }
}

main().catch((err) => {
    if (err) console.error(err)

    process.exit(1)
})
