import type { AppPage } from "./defineAppPage";

const pages = shallowRef<AppPage[]>([])

export function useAppPages(){
    return pages
}