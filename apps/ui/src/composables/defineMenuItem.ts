import type { RouteRecordRaw } from "vue-router"

export interface MenuItem {
    order?: number
    name: string
    label: string
    to?: RouteRecordRaw
    icon: string
    component: any
}

export function defineMenuItem(options: MenuItem) {
    return options
}
