interface RouteResolver {
  (...args: any): Promise<any>
}

export default class Router {
  public routes = new Map<string, RouteResolver>()

  constructor(public resolveHandler: (nameOrHandler: string | RouteResolver) => RouteResolver) {}

  public use(callback: (path: string, handler: RouteResolver) => void) {
    return Array.from(this.routes.entries()).forEach(([p, h]) => callback(p, h))
  }

  public register(path: string, handler: string | RouteResolver) {
    if (!this.resolveHandler) {
      throw new Error('router: resolveHandler must be defined before register routes')
    }

    const resolver = this.resolveHandler(handler)

    this.routes.set(path, resolver)
  }
}
