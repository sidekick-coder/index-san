import { App, Component } from 'vue'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

interface ComponentItem {
    name: string
    value: Component
}

export function createGCRegister(){
    const modules = import.meta.glob('../components/**/*.vue', { eager: true })
    const components: ComponentItem[] = []

    Object.entries<any>(modules)
        .forEach(([key, value]) => {
            const basename = key.split('/').pop() as string

            const name = upperFirst(camelCase(basename.replace('.vue', '')))
            
            components.push({
                name,
                value: value.default ?? value
            })
        })

    function install(app: App) {
        components.forEach(c => app.component(c.name, c.value))
    }
    
    return { install }

}