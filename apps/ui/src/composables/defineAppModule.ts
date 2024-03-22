import type { RouteRecordRaw } from "vue-router";

export interface AppModuleSetupContext {
    addRoute: (route: RouteRecordRaw) => void
}

export interface AppModule {    
    name?: string
    order?: number
    setup: (context: AppModuleSetupContext) => void | Promise<void>
}

export function defineAppModule(appModule: AppModule) {
    return appModule
}
