import { App, Component } from 'vue'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

interface ComponentItem {
    name: string
    value: Component
}

export function createComponentObject() {
    const modules = import.meta.glob('@components/**/*.vue', { eager: true })
    const components: Record<string, ComponentItem> = {}

    Object.entries<any>(modules).forEach(([key, value]) => {
        const basename = key.split('/').pop() as string

        const name = upperFirst(camelCase(basename.replace('.vue', '')))

        value.default.name = name

        components[name] = value.default ?? value
    })

    return components
}

export default (app: App) => {
    const components = createComponentObject()

    Object.entries(components).map(([key, value]) => app.component(key, value))
}
