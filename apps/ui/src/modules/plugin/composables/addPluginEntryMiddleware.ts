import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

const entryMiddlewares = useEntryMiddlewares()

export async function addPluginEntryMiddleware(pluginId: string, filename: string){
	const fileModule = await importJavascriptFile(resolve('.is/plugins', pluginId, filename))

	entryMiddlewares.value.push(fileModule?.default)
}
