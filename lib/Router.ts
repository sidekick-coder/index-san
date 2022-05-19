import { injectable, container } from 'tsyringe'
@injectable()
export default class Router {
  public routes = new Map<string, () => Promise<any>>()
  public controllers = new Map()

  public findController(name: string) {
    if (this.controllers.has(name)) {
      return this.controllers.get(name)
    }

    const Module = require(`../app/controllers/${name}`).default

    this.controllers.set(name, container.resolve(Module))

    return this.controllers.get(name)
  }

  public createContext(...args: any[]) {
    return args
  }

  public use(callback: (path: string, handler: (...args: any[]) => Promise<any>) => void) {
    return Array.from(this.routes.entries()).forEach(([p, h]) => callback(p, h))
  }

  public register(path: string, handler: string) {
    const [controllerName, method] = handler.split('.')

    const controller = this.findController(controllerName)

    this.routes.set(path, controller[method].bind(controller))
  }
}
