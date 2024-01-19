import { App } from 'vue'

export interface PluginFn {
    (app: App): Promise<any>
}

export interface StartupFn {
    (app: App): Promise<any>
}

export function defineStartup(cb: StartupFn) {
    return cb
}

export function definePlugin(cb: PluginFn) {
    return cb
}
