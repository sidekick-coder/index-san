const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)



module.exports = {
    packagerConfig: {
        name: 'index-san'
    },
    rebuildConfig: {},
    makers: [
        // {
        //     name: '@electron-forge/maker-zip',
        //     platforms: ['win32'],
        // },
        // {
        //     name: '@electron-forge/maker-squirrel',
        //     config: {
        //         name: 'index_san'
        //     },
        // },
        // {
        //     name: '@electron-forge/maker-deb',
        //     config: {},
        // },
        // {
        //     name: '@electron-forge/maker-rpm',
        //     config: {},
        // },
    ],
    hooks: {
        postPackage: async () => {
            const outDir = path.resolve(__dirname, 'out', 'index-san-win32-x64', 'resources', 'app')
            
            const unnecessaryFiles = fs.readdirSync(outDir).filter(f => !['dist', 'package.json'].includes(f))

            await Promise.all(unnecessaryFiles.map(f => fs.promises.rm(path.resolve(outDir, f), {
                recursive: true
            })))
            
            await exec(`npm install --production --prefix ${outDir}`)
                .then(r => console.log(r.stdout))
                .catch(r => console.log(r.stdout))
        },
    }
}
