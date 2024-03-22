import type { Router } from "vue-router";

export interface AppModuleSetupContext {
    router: Router
    addRoute: Router['addRoute']
}

export interface AppModule {    
    name?: string
    order?: number
    setup: (context: AppModuleSetupContext) => void | Promise<void>
}

export function defineAppModule(appModule: AppModule) {
    return appModule
}
