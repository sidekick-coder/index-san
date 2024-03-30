import './assets/tailwind.scss'
import './assets/main.scss'

import { createApp as createVueApp } from 'vue'
import type { Plugin } from '@/composables/definePlugin'
import App from './App.vue'
import router from '@/router/router'

import { vVisible } from './directives/vVisible'
import type { AppModule } from './composables/defineAppModule'

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

    const appPages = useAppPages()
    const entryMiddlewares = useEntryMiddlewares()
    const menuItems = useMenuItems()
    
    const plugins = await getPlugins()
    const appModules = await getAppModules()

    app.directive('visible', vVisible)    

    for await (const plugin of plugins) {
        console.debug(`[app] plugin ${plugin.name} loaded`)

        if (plugin.setup) {
            await plugin.setup(app)
        }
    }


    for await (const appModule of appModules) {
        console.debug(`[app] module ${appModule.name} loaded`)

        await appModule.setup({
            addAppPage: p => {
                console.debug(`[app] module ${appModule.name} added app page ${p.name}`)

                appPages.value.push(p)
            },

            addEntryMiddleware: m => {
                console.debug(`[app] module ${appModule.name} added entry middleware`)

                entryMiddlewares.value.push(m)
            },

            addRoute: r => {
                console.debug(`[app] module ${appModule.name} added route ${r.path}`)
    
                router.addRoute(r)
            },

            addMenuItem: m => {
                console.debug(`[app] module ${appModule.name} added menu item ${m.name}`)

                menuItems.value.push(m)
            }
        })
    }

    app.use(router)

    return app
}

createApp().then((app) => {
    app.mount('#app')
})

