/// <reference types="vite/client" />
/// <reference types="vue-i18n/dist/vue-i18n.d.ts" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
