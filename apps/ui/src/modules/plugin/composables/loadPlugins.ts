import { createCompiler } from "hecate/composables/createCompiler";
import type { IsPluginInfo } from "./listPlugins";
import { addPluginImport } from "./plugin-resolvers";
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript";

const loading = ref(true)

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

	await pluginDefinition.setup({
		addImport: (key: string, filename: string) => {
			addPluginImport(key, filename)

			console.log(`[plugin(${pluginInfo.id})] add module`, { key, filename })
		},
		resolve: (...args: string[]) => resolve(folder, ...args),
		addComponent: (payload: any) => components.push(payload)
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
