import type { MenuItem } from "@/composables/defineMenuItem"
import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript"

interface AddPayload extends Omit<MenuItem, 'component'> {
    pluginId: string
    name: string
    filename: string
}

const appMenuItems = useMenuItems()

export function addPluginMenuItem(payload: AddPayload) {
    const exists = appMenuItems.value.find(menu => menu.name === payload.name)

    if (exists) return

    const { pluginId, filename, ...menuDef } = payload

    let component: any

    if (filename) {
        component = defineAsyncComponent(async () => {
            const fullFilename = resolve('.is/plugins', pluginId, filename)

            const fileModule = await importJavascriptFile(fullFilename)

            return fileModule?.default
        })
    }


    appMenuItems.value.push({
        ...menuDef,
        component
    })

}
