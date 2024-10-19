import type { IsPluginInfo } from "./listPlugins";
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript";

const loading = ref(true)
const appMenuItems = useMenuItems()

export async function loadPlugin(pluginInfo: IsPluginInfo) {

	for (const importDef of pluginInfo.imports) {
		addPluginImport(pluginInfo.id, importDef.name, importDef.filename)
	}

	for await (const pageDef of pluginInfo.pages) {
		await addPluginAppPage({
			pluginId: pluginInfo.id,
			name: pageDef.name,
			filename: pageDef.filename
		})

		console.debug(`[plugin(${pluginInfo.id})] add app page`, pageDef)
	}

	for await (const middlewareDef of pluginInfo.middlewares) {
		await addPluginEntryMiddleware(pluginInfo.id, middlewareDef.filename)
	}

	for await (const componentDef of pluginInfo.components) {
		await addPluginComponent({
			pluginId: pluginInfo.id,
			name: componentDef.name,
			icon: componentDef.icon,
			filename: componentDef.filename
		})

		console.debug(`[plugin(${pluginInfo.id})] add component`, componentDef)
	}


	for await (const menuDef of pluginInfo.menu) {
		await addPluginMenuItem({
			...menuDef,
			pluginId: pluginInfo.id
		})

		console.debug(`[plugin(${pluginInfo.id})] add menu`, menuDef)
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
