import { useState } from '@/composables/state'
import { App, watch } from 'vue'

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
    legacy: false
})

export function createI18n(){
    function install(app: App){
        app.use(i18n)
    }

    return { install }
}

export function useLocale(){
    const state= useState('app:i18n:locale', 'en-US', { localStorage: true })

    watch(state, (value) => {
        i18n.global.locale.value = value
    }, { immediate: true })


    return state
}