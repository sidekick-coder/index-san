// build artifacts

const path = require('path')
const fg = require('fast-glob')
const fs  = require('fs')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const BASE_PATH = path.resolve(__dirname, '..')

async function main(){    
    const desktopPath = path.resolve(BASE_PATH, 'packages', 'desktop')
    const outputFolder = path.resolve(BASE_PATH, 'artifacts')

    if (fs.existsSync(outputFolder)) {
        fs.rmSync(outputFolder, { recursive: true })
    }


    fs.mkdirSync(outputFolder, { recursive: true })

    console.log('build desktop app')

    await exec('npm -w desktop run build')
        .then(r => console.log(r.stdout))
        .catch(r => console.log(r.stdout))

    console.log('making desktop app')

    await exec('npm -w desktop run make')
        .then(r => console.log(r.stdout))
        .catch(r => console.log(r.stdout))

    console.log('moving artifacts')

    const pattern = path.resolve(desktopPath, '**/*.zip').split(path.sep).join('/')

    const files = await fg(pattern)

    await Promise.all(
        files
            .map(f => f.split('/').join(path.sep))
            .map(f => fs.promises.rename(f, path.resolve(outputFolder, path.basename(f)) ))
    )
        

    console.log('operation ended')

}

main()


// npm version --git-tag-version false