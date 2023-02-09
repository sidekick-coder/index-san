import { App, Component } from 'vue'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

interface ComponentItem {
    name: string
    value: Component
}

export default (app: App) => {
    const modules = import.meta.glob('@root/node_modules/vue-wind/components/**/*.vue', {
        eager: true,
    })

    const components: ComponentItem[] = []

    Object.entries<any>(modules).forEach(([key, value]) => {
        const basename = key.split('/').pop() as string

        const name = upperFirst(camelCase(basename.replace('.vue', '')))

        components.push({
            name,
            value: value.default ?? value,
        })
    })

    components.forEach((c) => app.component(c.name, c.value))
}
