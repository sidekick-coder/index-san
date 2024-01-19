import { createI18n } from 'vue-i18n'

const files = import.meta.glob('../languages/*.ts', { eager: true })
const messages: any = {}

Object.entries(files).forEach(([filename, value]: any) => {
    const name = filename.replace('../languages/', '').replace('.ts', '')

    messages[name] = value.default
})

const i18n = createI18n({
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages,
    legacy: false,
})


export default definePlugin({
    setup(app) {
        app.use(i18n)
    }
})