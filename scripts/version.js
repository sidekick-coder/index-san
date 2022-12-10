const path = require('path')
const fs = require('fs')
const { command } = require('./utils')

const BASE_PATH = path.resolve(__dirname, '..')

const [versionName] = process.argv.slice(2)

if (!versionName) {
    console.error('missing args')
    return
}

async function main() {
    const packages = ['core', 'desktop']

    for await (const name of packages) {
        await command(`npm -w ${name} version ${versionName}`)
    }

    await command(`npm version ${versionName} --git-tag-version false `)

    await command('git add .')
    await command(`git commit -m "feat: v${versionName}" `)
    await command(`git tag v${versionName} `)
}

main().catch(console.error)

// npm version --git-tag-version false
