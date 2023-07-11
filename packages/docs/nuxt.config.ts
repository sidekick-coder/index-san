import path from 'path'

const appPath = path.resolve(__dirname, '..', 'app')

export default defineNuxtConfig({
    extends: '@nuxt-themes/docus',
    modules: ['@nuxtjs/tailwindcss'],
    content: {
        locales: ['en-US', 'pt-BR'],
        defaultLocale: 'en-US',
    },
    components: {
        dirs: [
            '~/components',
            {
                path: path.resolve(appPath, 'components'),
                global: true,
                extensions: ['.vue'],
                ignore: [
                    'VCard.vue',
                    'VCardContent.vue',
                    'VCardHead.vue',
                    'VCardTitle.vue',
                    'VChart.vue',
                    'VCheckbox.vue',
                    'VCode.vue',
                    'VContainer.vue',
                    'VDialog.vue',
                    'VDivider.vue',
                    'VDrawer.vue',
                    'VForm.vue',
                    'VGallery.vue',
                    'VIcon.vue',
                    'VIconPicker.vue',
                    'VInput.vue',
                    'VLayout.vue',
                    'VLayoutContent.vue',
                    'VLayoutDrawer.vue',
                    'VLayoutToolbar.vue',
                    'VLink.vue',
                    'VListItem.vue',
                    'VLogo.vue',
                    'VMenu.vue',
                    'VResizeLine.vue',
                    'VSelect.vue',
                    'VTab.vue',
                    'VTabItem.vue',
                    'VTable.vue',
                    'VTd.vue',
                    'VTextarea.vue',
                    'VTh.vue',
                    'VTooltip.vue',
                    'VTr.vue',
                ],
            },
        ],
    },
    alias: {
        '@index-san/core': path.resolve(__dirname, '..', 'core'),
        // app
        '@components': path.resolve(appPath, 'components'),
        '@composables': path.resolve(appPath, 'composables'),
        '@plugins': path.resolve(appPath, 'plugins'),
        '@modules': path.resolve(appPath, 'modules'),
        '@store': path.resolve(appPath, 'store'),
    },
    tailwindcss: {
        cssPath: path.resolve(__dirname, '..', 'app', 'assets', 'tailwind.scss'),
        configPath: path.resolve(appPath, 'tailwind.config.js'),
        injectPosition: 'last',
    },
    pinceau: {
        preflight: false,
    },
})
