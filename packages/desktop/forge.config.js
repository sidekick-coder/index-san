module.exports = {
    packagerConfig: {
        name: 'index-san',
        icon: 'resources/icons/logo.ico',
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
}
