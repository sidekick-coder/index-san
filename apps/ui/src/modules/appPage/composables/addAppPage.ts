import type { AppPage } from "./defineAppPage";

export function addAppPage(options: AppPage) {
    const pages = useAppPages()

    const exists = pages.value.find(page => page.name === options.name)

    if (exists) return

    pages.value.push(options)

    console.debug(`[app-page] added app page ${options.name}`)
}
