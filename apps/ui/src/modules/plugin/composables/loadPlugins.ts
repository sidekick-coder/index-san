import { createCompiler } from "hecate/composables/createCompiler";
import type { IsPluginInfo } from "./listPlugins";

export async function loadPlugin(pluginInfo: IsPluginInfo) {
	const { drive, decode, resolve } = useDrive()

	const filename = resolve('.is/plugins', pluginInfo.id, 'index.js')

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

	await pluginDefinition.setup()

}


export async function loadActivePlugins() {
	const plugins = await listPlugins()

	const activePlugins = plugins.filter(p => p.active)

	for await (const p of activePlugins) {
		await loadPlugin(p)
	}

}
