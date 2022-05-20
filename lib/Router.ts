const PathMatch = require('path-match')({
  // path-to-regexp options
  sensitive: false,
  strict: false,
  end: false,
})

interface RouteResolver {
  (...args: any): Promise<any>
}

interface Route {
  name: string
  path: string
  handler: RouteResolver
  method: 'get' | 'patch'
}
export default class Router {
  public routes: Route[] = []

  constructor(public resolveHandler: (nameOrHandler: string | RouteResolver) => RouteResolver) {}

  public use(callback: (path: string, handler: RouteResolver) => void) {
    return this.routes.forEach((route) => callback(route.path, route.handler))
  }

  public register(path: string, handler: string | RouteResolver) {
    if (!this.resolveHandler) {
      throw new Error('router: resolveHandler must be defined before register routes')
    }

    const resolver = this.resolveHandler(handler)

    this.routes.push({
      name: path,
      path,
      handler: resolver,
      method: 'get',
    })
  }

  public get(path: string, handler: string | RouteResolver) {
    if (!this.resolveHandler) {
      throw new Error('router: resolveHandler must be defined before register routes')
    }

    const resolver = this.resolveHandler(handler)

    this.routes.push({
      name: path,
      path,
      handler: resolver,
      method: 'get',
    })
  }

  public patch(path: string, handler: string | RouteResolver) {
    if (!this.resolveHandler) {
      throw new Error('router: resolveHandler must be defined before register routes')
    }

    const resolver = this.resolveHandler(handler)

    this.routes.push({
      name: path,
      path,
      handler: resolver,
      method: 'patch',
    })
  }

  public async resolve(method: string, url: string, data?: any) {
    const route = this.routes
      .filter((route) => route.method === method)
      .find((route) => PathMatch(route.path)(url))

    if (!route) {
      throw new Error(`router: route ${url} not found`)
    }

    const match = PathMatch(route.path)

    const params = match(url)

    const context = { params, data }

    return route.handler(context)
  }
}
