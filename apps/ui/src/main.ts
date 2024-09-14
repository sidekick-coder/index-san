import './assets/tailwind.scss'
import './assets/main.scss'

import { createApp as createVueApp } from 'vue'
import type { Plugin } from '@/composables/definePlugin'
import App from './App.vue'

import { vVisible } from './directives/vVisible'
import type { AppModule } from './composables/defineAppModule'
import { createRouter, createWebHistory } from 'vue-router'

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

	appModules.sort((a, b) => (a.order || 99) - (b.order || 99))

	return appModules as AppModule[]

}

async function createApp() {
	const app = createVueApp(App)
	const router = createRouter({
		history: createWebHistory(),
		routes: []
	})

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

		const log = (message: string, ...args: string[])  => console.debug(`[${appModule.name}] ${message}`, ...args)

		await appModule.setup({
			addAppPage: p => {
				log(`added app page ${p.name}`)

				appPages.value.push(p)
			},

			addEntryMiddleware: m => {
				log(`added entry middleware`)

				entryMiddlewares.value.push(m)
			},

			addRoute(a: any, b: any){
				const path = typeof a === 'string' ? b.path : a.path

				log(`added route ${path}`)

				return router.addRoute(a, b)
			},

			addMenuItem: m => {
				log(`added menu item ${m.name}`)

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

