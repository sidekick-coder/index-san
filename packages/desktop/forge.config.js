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
        packageAfterCopy: async (
            /** @type {any} */ forgeConfig,
            /** @type {string} */ buildPath,
            /** @type {string} */ electronVersion,
            /** @type {string} */ platform,
            /** @type {string} */ arch,
        ) => {
            // this is a workaround until we find a proper solution
            // for running electron-forge in a mono repository
            await bundle(__dirname, buildPath)
        },
    }
}
