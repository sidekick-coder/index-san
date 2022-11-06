const { bundle } = require('./bundler')

module.exports = {
    packagerConfig: {
        name: 'index-san'
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip'
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
    hooks: {
        packageAfterCopy: async (
            /** @type {any} */ _forgeConfig,
            /** @type {string} */ buildPath,
        ) => {
            // this is a workaround until we find a proper solution
            // for running electron-forge in a mono repository
            await bundle(__dirname, buildPath)
        },
    }
}
