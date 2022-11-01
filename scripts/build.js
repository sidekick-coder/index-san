// build artifacts

const path = require('path')
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

    console.log('making desktop app')

    await exec('npm -w desktop run make')
        .then(r => console.log(r.stdout))
        .catch(r => console.log(r.stdout))

    console.log('moving artifacts')

    await fs.promises.rename(
        path.resolve(desktopPath, 'out', 'make', 'zip', 'win32', 'x64',  'index-san-win32-x64-0.1.0.zip'),
        path.resolve(outputFolder, 'index-san-win32-x64-0.1.0.zip')
    )

    console.log('operation ended')

}

main()


// npm version --git-tag-version false