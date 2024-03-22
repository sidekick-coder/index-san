import './assets/tailwind.scss'
import './assets/main.scss'

import { createApp as createVueApp } from 'vue'
import type { Plugin } from '@/composables/definePlugin'
import App from './App.vue'
import router from '@/router/router'

import { vVisible } from './directives/vVisible'
import type { AppModule, AppModuleSetupContext } from './composables/defineAppModule'
import type { RouteRecordRaw } from 'vue-router'

async function getPlugins() {
    const files = import.meta.glob<Record<string, Plugin>>('./plugins/*.ts', { eager: true })
    
    const plugins: Plugin[] = Object.entries(files)
        .filter(([, p]) => !!p.default)
        .map(([name, p]) => ({
            name: name.replace('./plugins/', ''),
            order: 999,
            ...p.default,
        }))

    plugins.sort((a, b) => a.order! - b.order!)

    return plugins
}

async function getAppModules() {
    const files = import.meta.glob<Record<string, AppModule>>('./modules/**/index.ts', { eager: true })

    const appModules = Object.entries(files)
        .filter(([, p]) => !!p.default)
        .map(([name, p]) => ({
            name: name.replace('./modules/', '').replace('/index.ts', ''),
            order: 999,
            ...p.default,
        }))

    appModules.sort((a, b) => a.order! - b.order!)
    
    return appModules as AppModule[]

}

async function createApp() {
    const app = createVueApp(App)

    app.directive('visible', vVisible)
    
    const plugins = await getPlugins()

    for await (const plugin of plugins) {
        console.debug(`[app] plugin ${plugin.name} loaded`)

        if (plugin.setup) {
            await plugin.setup(app)
        }
    }

    const appModules = await getAppModules()

    for await (const appModule of appModules) {
        console.debug(`[app] module ${appModule.name} loaded`)

        await appModule.setup({
            addRoute: r => {
                console.debug(`[app] module ${appModule.name} added route ${r.path}`)
    
                router.addRoute(r)
            }
        })
    }

    app.use(router)

    return app
}

createApp().then((app) => {
    app.mount('#app')
})

