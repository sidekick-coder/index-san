export interface AppPage {
    // unique name of the page
    name: string
    component: any
}

export function defineAppPage(page: AppPage) {
    return page
}