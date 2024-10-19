import type { MenuItem } from "@/composables/defineMenuItem"
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

interface AddPayload extends Omit<MenuItem, 'component'> {
	pluginId: string
	name: string
	filename: string
}

const appMenuItems = useMenuItems()

export async function addPluginMenuItem(payload: AddPayload) {
	const { pluginId, filename, ...menuDef } = payload
	const fileModule = await importJavascriptFile(resolve('.is/plugins', payload.pluginId, payload.filename))
	
	appMenuItems.value.push({
		...menuDef,
		component: fileModule?.default
	})

}
