const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const BASE_PATH = path.resolve(__dirname, '..')

const [versionName] = process.argv.slice(2)

if (!versionName) {
    console.error('missing args')
    return
}

async function main() {
    const packages = await fs.promises.readdir(path.resolve(BASE_PATH, 'packages'))

    for await (const name of packages) {
        await exec(`npm -w ${name} version ${versionName}`)
            .then((r) => console.log(r.stdout))
            .catch((r) => console.log(r.stdout))
    }

    await exec(`npm version ${versionName} --git-tag-version false `)
        .then((r) => console.log(r.stdout))
        .catch((r) => console.log(r.stdout))
}

main()

// npm version --git-tag-version false
