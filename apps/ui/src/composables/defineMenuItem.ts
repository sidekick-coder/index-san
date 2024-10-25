import type { RouterLinkProps } from "vue-router"

export interface MenuItem {
    order?: number
    name: string
    label: string
    to?: RouterLinkProps['to']
    position?: 'top' | 'bottom'
    icon: string
    component?: any
}

export function defineMenuItem(options: MenuItem) {
    return options
}
