import type { MenuItem } from "@/composables/defineMenuItem"
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

interface AddPayload extends Omit<MenuItem, 'component'> {
	pluginId: string
	name: string
	filename: string
}

const appMenuItems = useMenuItems()

export async function addPluginMenuItem(payload: AddPayload) {
    const exists = appMenuItems.value.find(menu => menu.name === payload.name)

    if (exists) return

	const { pluginId, filename, ...menuDef } = payload
	
    let component: any

	if (filename) {
        const fullFilename = resolve('.is/plugins', pluginId, filename)

		const fileModule = await importJavascriptFile(fullFilename)

		component = fileModule.default
	}

	
	appMenuItems.value.push({
		...menuDef,
		component
	})

}
