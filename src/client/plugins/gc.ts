import { definePlugin } from '@/composables/define-plugin'
import { upperFirst, camelCase } from 'lodash'

export default definePlugin(({ app }) => {
  const files = import.meta.globEager('../components/*.vue')

  Object.entries(files).forEach(([filename, component]) => {
    const name = upperFirst(camelCase((filename.split('/').pop() as string).replace('.vue', '')))

    app.component(name, component.default || component)
  })
})
