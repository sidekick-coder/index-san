import { App } from 'vue'

import { createI18n as baseCreateI18n } from 'vue-i18n'

const files = import.meta.glob('../i18n/*.ts', { eager: true })
const messages = {}

Object.entries(files).forEach(([filename, value]: any) => {
    const name = filename.replace('../i18n/', '').replace('.ts', '')

    messages[name] = value.default
})

export const i18n = baseCreateI18n({
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages,
    legacy: false,
})

export function useLocale() {
    return i18n.global.locale
}

export function useLanguages() {
    return Object.keys(messages)
}

export default (app: App) => {
    app.use(i18n)
}
