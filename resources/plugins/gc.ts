import { upperFirst, camelCase } from 'lodash'
import { App } from 'vue'

export default ({ app }: { app: App }) => {
  const files = import.meta.globEager('../components/*.vue')

  Object.entries(files).forEach(([filename, component]) => {
    const name = upperFirst(camelCase((filename.split('/').pop() as string).replace('.vue', '')))

    app.component(name, component.default || component)
  })
}
