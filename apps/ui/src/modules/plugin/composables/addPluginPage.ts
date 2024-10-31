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

export async function addPluginAppPage(payload: AddPayload) {

    const filename = resolve('.is/plugins', payload.pluginId, payload.filename)

    const fileModule = await importJavascriptFile(filename)

    addAppPage({
        name: payload.name,
        component: fileModule?.default,
    })
}
