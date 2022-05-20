import { App } from 'vue'

interface Context {
  app: App
}

export function definePlugin(callback: (ctx: Context) => void) {
  return callback
}
