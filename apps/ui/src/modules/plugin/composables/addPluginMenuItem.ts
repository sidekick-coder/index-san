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
	let component: any

	if (filename) {
		const fileModule = await importJavascriptFile(resolve('.is/plugins', payload.pluginId, payload.filename))

		component = fileModule.default
	}

	
	appMenuItems.value.push({
		...menuDef,
		component
	})

}
