import { useCase } from './use-case'

export async function useIndexSanPlugins() {
  const data = await useCase<{ render: string }>('list-plugins').then((d) =>
    d.render
      .replace(/import (.*) from ("|')vue("|')/, 'const $1 = window.vue')
      .replace(/import (.*) from ("|')composables\/use-case("|')/, 'const $1 = window.useCase')
  )

  const base64 = 'data:text/javascript;base64,' + btoa(data)

  const plugin = await import(/** @vite-ignore */ base64)

  return plugin.default
}
