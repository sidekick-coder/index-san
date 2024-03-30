export interface MenuItem {
    order?: number
    name: string
    label: string
    icon: string
    component: any
}

export function defineMenuItem(options: MenuItem) {
    return options
}