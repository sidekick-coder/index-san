import type { RouteRecordRaw } from "vue-router";
import type { AppPage } from "./defineAppPage";
import type { EntryMiddleware } from "./defineEntryMiddleware";

export interface AppModuleSetupContext {
    // vue router
    addRoute: (route: RouteRecordRaw) => void

    // entry middleware
    addEntryMiddleware: (middleware: EntryMiddleware) => void
    
    // app pages
    addAppPage: (appPage: AppPage) => void
}

export interface AppModule {    
    name?: string
    order?: number
    setup: (context: AppModuleSetupContext) => void | Promise<void>
}

export function defineAppModule(appModule: AppModule) {
    return appModule
}
