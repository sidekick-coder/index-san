import type { Router, RouteRecordRaw } from "vue-router";
import type { EntryMiddleware } from "./defineEntryMiddleware";
import type { MenuItem } from "./defineMenuItem";

interface AddRoute {
	(a: string, b: RouteRecordRaw): void
	(a: RouteRecordRaw, b?: never): void
}

export interface AppModuleSetupContext {
    // vue router
    addRoute: AddRoute 
    // entry middleware
    addEntryMiddleware: (middleware: EntryMiddleware) => void
    // add menu item
    addMenuItem: (menuItem: MenuItem) => void
}

export interface AppModule {    
    name?: string
    order?: number
    setup: (context: AppModuleSetupContext) => void | Promise<void>
}

export function defineAppModule(appModule: AppModule) {
    return appModule
}
