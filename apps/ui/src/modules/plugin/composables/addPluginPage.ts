import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

interface AddPayload {
	pluginId: string
	name: string
	filename: string	
}

export interface PluginComponentItem {
	name: string
	pluginId: string
	component: any
}

const appPages = useAppPages()

export async function addPluginAppPage(payload: AddPayload){	
    const exists = appPages.value.find(page => page.name === payload.name)

    if (exists) return

	const fileModule = await importJavascriptFile(resolve('.is/plugins', payload.pluginId, payload.filename))

	appPages.value.push({
		name: payload.name,
		component: fileModule?.default,
	})
}
