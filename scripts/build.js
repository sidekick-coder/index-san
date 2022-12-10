// build artifacts

const path = require('path')
const fg = require('fast-glob')
const fs = require('fs')
const { command } = require('./utils')

const BASE_PATH = path.resolve(__dirname, '..')

async function main() {
    const desktopPath = path.resolve(BASE_PATH, 'packages', 'desktop')
    const outputFolder = path.resolve(BASE_PATH, 'artifacts')

    if (fs.existsSync(outputFolder)) {
        fs.rmSync(outputFolder, { recursive: true })
    }

    fs.mkdirSync(outputFolder, { recursive: true })

    // build desktop app

    await command('npm -w desktop run build')

    // making desktop app

    await command('npm -w desktop run make')

    // moving artifacts

    const pattern = path.resolve(desktopPath, 'out', 'make', '**/*').split(path.sep).join('/')

    const files = await fg(pattern)

    await Promise.all(
        files
            .map((f) => f.split('/').join(path.sep))
            .map((f) => fs.promises.rename(f, path.resolve(outputFolder, path.basename(f))))
    )
}

main().catch((err) => {
    if (err) console.error(err)

    process.exit(1)
})
