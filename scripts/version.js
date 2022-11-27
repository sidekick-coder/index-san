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
    const packages = await fs.promises.readdir(path.resolve(BASE_PATH, 'packages'))

    for await (const name of packages) {
        await command(`npm -w ${name} version ${versionName}`, { stout: true, stderr: true })
    }

    await command(`npm version ${versionName} --git-tag-version false `, {
        stout: true,
        stderr: true,
    })

    await command('git add .', { stout: true, stderr: true })
    await command(`git commit -m "feat: v${versionName}" `, { stout: true, stderr: true })
    await command(`git tag v${versionName} `, { stout: true, stderr: true })
}

main().catch(console.error)

// npm version --git-tag-version false
