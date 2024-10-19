import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

interface AddPayload {
	pluginId: string
	name: string
	filename: string	
	icon?: string
}

export interface PluginComponentItem {
	name: string
	pluginId: string
	icon?: string
	component: any
}

const register = shallowRef<PluginComponentItem[]>([])

export function usePluginComponents(){
	return register.value 
}

export async function addPluginComponent(payload: AddPayload){
	
	const componentModule = await importJavascriptFile(resolve('.is/plugins', payload.pluginId, payload.filename))

	register.value.push({
		pluginId: payload.pluginId,
		name: payload.name,
		icon: payload.icon,
		component: componentModule?.default,
	})
}
