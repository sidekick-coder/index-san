import type { DriveEntry } from "./useDrive";
import type { RouteRecordRaw, Router  } from 'vue-router'

export interface EntryMiddlewareContext {
    entry: DriveEntry
    route: RouteRecordRaw
    router: Router
}

export interface EntryMiddleware {
    (context: EntryMiddlewareContext): Promise<any>
}

export function defineEntryMiddleware(middleware: EntryMiddleware) {
    return middleware
}