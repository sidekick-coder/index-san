export function hasPlugin(plugin: string) {
    return loadedPlugins.value.has(plugin)
}
