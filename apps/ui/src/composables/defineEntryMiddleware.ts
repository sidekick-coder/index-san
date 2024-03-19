import type { DriveEntry } from "./useDrive";
import type { RouteLocationRaw, Router  } from 'vue-router'

export interface EntryMiddlewareContext {
    entry: DriveEntry
}

export interface EntryMiddleware {
    (context: EntryMiddlewareContext): Promise<RouteLocationRaw | null> | RouteLocationRaw | null
}

export function defineEntryMiddleware(middleware: EntryMiddleware) {
    return middleware
}