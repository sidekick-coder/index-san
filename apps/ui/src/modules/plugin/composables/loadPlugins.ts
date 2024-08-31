import { createCompiler } from "hecate/composables/createCompiler";
import type { IsPluginInfo } from "./listPlugins";
import { addPluginImport } from "./plugin-resolvers";
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript";
import type { EntryMiddleware } from "@/composables/defineEntryMiddleware";
import type { AppPage } from "@/composables/defineAppPage";

const loading = ref(true)
const entryMiddlewares = useEntryMiddlewares()
const appPages = useAppPages()

export async function loadPlugin(pluginInfo: IsPluginInfo) {
	const { drive, decode, resolve } = useDrive()

	const folder = resolve('.is/plugins', pluginInfo.id)

	const filename = resolve(folder, 'index.js')

	const fileExist = await drive.value.get(filename)

	if (!fileExist) {
		console.debug('[plugins] index.js file not found fo plugin: ', pluginInfo)
		return
	}

	const contents = await drive.value.read(filename)

	const text = decode(contents!)

	const compiler = createCompiler({
		importResolvers: [],
		logger: {
			log(...args) {
				console.log(`[plugins][${pluginInfo.name}]`, ...args)
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
	const pages = [] as any[]

	await pluginDefinition.setup({
		resolve: (...args: string[]) => resolve(folder, ...args),
		addComponent: (payload: any) => components.push(payload),
		addAppPage: (payload: any) => pages.push(payload),
		addImport: (key: string, filename: string) => {
			addPluginImport(key, filename)

			console.log(`[plugin(${pluginInfo.id})] add module`, { key, filename })
		},
		addEntryMiddleware: (payload: EntryMiddleware) => {
			entryMiddlewares.value.push(payload)

			console.log(`[plugin(${pluginInfo.id})] add entry middleware`, payload)
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

			console.log(`[plugin(${pluginInfo.id})] add component`, componentDef)
		}
	}

	for await (const pageDef of pages) {
		const component = await importJavascriptFile(pageDef.filename)

		if (component?.default) {
			appPages.value.push({
				name: pageDef.name,
				component: component.default
			})

			console.log(`[plugin(${pluginInfo.id})] add app page`, pageDef)
		}
	}


}


export async function loadActivePlugins() {
	loading.value = true

	const plugins = await listPlugins()

	const activePlugins = plugins.filter(p => p.active)

	for await (const p of activePlugins) {
		await loadPlugin(p).catch((err) => {
			console.log(`[plugin(${p.id})] error loading plugin`, { err })
		})
	}

	loading.value = false
}


export const $plugins = reactive({
	loading
})
