import { importJavascriptFile } from "@/modules/hecate/resolvers/javascript";
import type { IsPluginInfo } from "./listPlugins";

export const loadedPlugins = ref(new Map<string, IsPluginInfo>())
const loading = ref(true)

export async function loadPlugin(pluginInfo: IsPluginInfo) {
    const isLoaded = loadedPlugins.value.has(pluginInfo.id)

    if (isLoaded) {
        return
    }

    console.group(`[plugins] ${pluginInfo.id}`)

    const drive = useWorkspaceDrive()

    for (const importDef of pluginInfo.imports) {
        addPluginImport(pluginInfo.id, importDef.name, importDef.filename)
    }

    for await (const pageDef of pluginInfo.pages) {
        await addPluginAppPage({
            pluginId: pluginInfo.id,
            name: pageDef.name,
            filename: pageDef.filename
        })

    }

    for await (const middlewareDef of pluginInfo.middlewares) {
        await addPluginEntryMiddleware(pluginInfo.id, middlewareDef.filename)
    }

    for await (const componentDef of pluginInfo.components) {
        await addPluginComponent({
            pluginId: pluginInfo.id,
            name: componentDef.name,
            icon: componentDef.icon,
            filename: componentDef.filename
        })

    }


    for await (const menuDef of pluginInfo.menu) {
        await addPluginMenuItem({
            ...menuDef,
            pluginId: pluginInfo.id
        })

    }

    const setupFile = resolve('/.is/plugins', pluginInfo.id, 'index.js')

    if (await drive.get(setupFile)) {
        const { start } = await importJavascriptFile(setupFile)

        if (start) {
            await start()
        }
    }

    loadedPlugins.value.set(pluginInfo.id, pluginInfo)

    console.debug(`[plugins] ${pluginInfo.id} loaded`)

    console.groupEnd()
}


export async function loadActivePlugins() {
    const plugins = await listPlugins()

    const activePlugins = plugins.filter(p => p.active)

    activePlugins.sort((a, b) => a.order - b.order)

    for await (const p of activePlugins) {
        await loadPlugin(p).catch((err) => console.error(err))
    }
}


export const $plugins = reactive({
    loading
})
