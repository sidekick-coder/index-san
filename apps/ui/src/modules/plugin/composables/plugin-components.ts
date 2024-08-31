
export interface PluginComponentItem {
	name: string
	icon?: string
	component: any
}

const register = shallowRef<PluginComponentItem[]>([])

export function usePluginComponents(){
	return register.value 
}

export function addPluginComponent(item: PluginComponentItem){
	register.value.push(item)
}
