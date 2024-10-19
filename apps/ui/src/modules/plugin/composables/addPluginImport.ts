import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"
import { defineImportResolver } from "hecate/composables/defineImportResolver"

const register = ref(new Map<string, string>)

const pluginResolver = defineImportResolver({
	test: key => {
		return register.value.has(key)
	} ,
	resolve: async (key) => {
		const filename = register.value.get(key)

		if (!filename) {
			throw new Error('error loading plugin file')
		}
	
		return importJavascriptFile(filename) 
	}
})

export function usePluginResolver(){
	return pluginResolver
}

export function addPluginImport(pluginId: string, key: string, filename: string){
	register.value.set(key, resolve('.is/plugins', pluginId, filename))
}
