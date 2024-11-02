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

export function addPluginAppPage(payload: AddPayload) {
    const component = defineAsyncComponent(async () => {
        const filename = resolve('.is/plugins', payload.pluginId, payload.filename)

        const fileModule = await importModule(filename)

        return fileModule?.default
    })

    addAppPage({
        name: payload.name,
        component,
    })
}
