const { command } = require('./utils')

async function main() {
    const tags = await command('git --no-pager tag -l --sort=creatordate')

    const [current, previous] = tags
        .split('\n')
        .filter((t) => t !== '')
        .reverse()

    await command(`npm run changelogen -- --from ${previous} --to ${current} --output CHANGELOG.md`)
}

main().catch(console.error)
