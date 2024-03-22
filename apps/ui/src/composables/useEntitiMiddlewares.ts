import type { AppPage } from "./defineAppPage";
import type { EntryMiddleware } from "./defineEntryMiddleware";

const entryMiddlewares = shallowRef<EntryMiddleware[]>([])

export function useEntryMiddlewares(){
    return entryMiddlewares
}