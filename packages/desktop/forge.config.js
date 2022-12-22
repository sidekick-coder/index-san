const { bundle } = require('./scripts/bundler')

module.exports = {
    packagerConfig: {
        name: 'index-san',
        icon: 'assets/logo.ico',
        prune: false,
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
        },
        {
            name: '@electron-forge/maker-squirrel',
        },
        // {
        //     name: '@electron-forge/maker-deb',
        //     config: {},
        // },
        // {
        //     name: '@electron-forge/maker-rpm',
        //     config: {},
        // },
    ],
    packageAfterCopy: async (/** @type {any} */ forgeConfig, /** @type {string} */ buildPath) => {
        // this is a workaround until we find a proper solution
        // for running electron-forge in a mono repository
        await bundle(__dirname, buildPath)
    },
}
