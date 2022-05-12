import { ipcMain } from 'electron'
import { ISEventContext } from './ISEventContext'

export default class Router {
  public controllers = new Map()

  public findController(name: string) {
    if (this.controllers.has(name)) {
      return this.controllers.get(name)
    }

    const Module = require(`../app/controllers/${name}`).default

    this.controllers.set(name, new Module())

    return this.controllers.get(name)
  }

  public register(path: string, handler: string) {
    const [controllerName, method] = handler.split('.')

    const controller = this.findController(controllerName)

    ipcMain.removeHandler(path)

    ipcMain.handle(path, (_, args) => {
      if (!controller[method]) {
        console.error(`Handler ${handler} not found`)
        return
      }

      const context: ISEventContext = {
        data: args,
      }

      return controller[method](context)
    })
  }
}
