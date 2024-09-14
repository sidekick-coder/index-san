import { createCompiler } from "hecate/composables/createCompiler";
import type { IsPluginInfo } from "./listPlugins";
import { addPluginImport } from "./plugin-resolvers";
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript";
import type { EntryMiddleware } from "@/composables/defineEntryMiddleware";

const loading = ref(true)
const entryMiddlewares = useEntryMiddlewares()
const appPages = useAppPages()
const appMenuItems = useMenuItems()

export async function loadPlugin(pluginInfo: IsPluginInfo) {
	const drive = useWorkspaceDrive()
	const folder = resolve('.is/plugins', pluginInfo.id)

	const filename = resolve(folder, 'index.js')

	const fileExist = await drive.get(filename)

	if (!fileExist) {
		console.debug('[plugins] index.js file not found fo plugin: ', pluginInfo)
		return
	}

	const contents = await drive.read(filename)

	const text = decode(contents!)

	const compiler = createCompiler({
		importResolvers: [],
		logger: {
			log(...args) {
				console.debug(`[plugins][${pluginInfo.name}]`, ...args)
			},
		}
	})

	const { exports } = await compiler.compile(text)

	const pluginDefinition = exports.default

	if (typeof pluginDefinition.setup !== 'function') {
		console.debug('[plugins] could not run plugin setup', pluginInfo)
		return
	}

	const components = [] as any[]
	const pages = new Map<string, any>()
	const menuItems = new Map<string, any>()

	await pluginDefinition.setup({
		resolve: (...args: string[]) => resolve(folder, ...args),
		addComponent: (payload: any) => components.push(payload),
		addAppPage: (payload: any) => pages.set(payload.name, payload),
		addMenuItem: (payload: any) => menuItems.set(payload.name, payload),
		addImport: (key: string, filename: string) => {
			addPluginImport(key, filename)

			console.debug(`[plugin(${pluginInfo.id})] add module`, { key, filename })
		},
		addEntryMiddleware: (payload: EntryMiddleware) => {
			entryMiddlewares.value.push(payload)

			console.debug(`[plugin(${pluginInfo.id})] add entry middleware`, payload)
		},
	})

	for await (const componentDef of components) {
		const component = await importJavascriptFile(componentDef.filename)

		if (component?.default) {
			addPluginComponent({
				name: componentDef.name,
				icon: componentDef.icon,
				component: component.default
			})

			console.debug(`[plugin(${pluginInfo.id})] add component`, componentDef)
		}
	}

	for await (const pageDef of Array.from(pages.values())) {
		const component = await importJavascriptFile(pageDef.filename)

		if (component?.default) {
			appPages.value.push({
				...pageDef,	
				component: component.default
			})

			console.debug(`[plugin(${pluginInfo.id})] add app page`, pageDef)
		}
	}

	for await (const menuDef of Array.from(menuItems.values())) {
		const component = await importJavascriptFile(menuDef.filename)

		if (component?.default) {
			appMenuItems.value.push({
				...menuDef,
				component: component.default
			})

			console.debug(`[plugin(${pluginInfo.id})] add menu`, menuDef)
		}
	}

}


export async function loadActivePlugins() {
	const plugins = await listPlugins()

	const activePlugins = plugins.filter(p => p.active)

	for await (const p of activePlugins) {
		await loadPlugin(p).catch((err) => {
			console.debug(`[plugin(${p.id})] error loading plugin`, { err })
		})
	}

	console.debug('[app] plugins loaded', activePlugins)
}


export const $plugins = reactive({
	loading
})
