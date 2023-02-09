const { command } = require('./utils')

const [versionName] = process.argv.slice(2)

if (!versionName) {
    console.error('missing args')
    return
}

async function main() {
    const packages = ['@is/core', '@is/app', '@is/docs', '@is/electron', '@is/tauri']

    // test
    await command('npm test')

    // build docs
    await command('npm -w docs run generate')

    // build app
    await command('npm run build')

    for await (const name of packages) {
        await command(`npm -w ${name} version ${versionName}`)
    }

    await command(`npm version ${versionName} --git-tag-version false `)

    await command('git add .')
    await command(`git commit -m "feat: v${versionName}" `)
    await command(`git tag v${versionName} `)
}

main().catch((err) => {
    if (err) console.error(err)

    process.exit(1)
})
