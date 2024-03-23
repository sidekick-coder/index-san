import type { DriveEntry } from "./useDrive";
export interface EntryMiddlewareContext {
    entry: DriveEntry
}

export interface EntryMiddlewareOptions {
    order?: number
}

export interface EntryMiddlewareSuccessResult {
    page: string
    props: Record<string, any>
}

export type EntryMiddlewareResult = EntryMiddlewareSuccessResult | null | undefined

export interface EntryMiddleware {
    order?: number
    handle: (context: EntryMiddlewareContext) => Promise<EntryMiddlewareResult> | EntryMiddlewareResult
}

export function defineEntryMiddleware(middleware: EntryMiddleware) {
    return middleware
}