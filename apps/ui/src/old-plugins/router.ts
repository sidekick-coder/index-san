import { App } from 'vue'
import { createRouter as baseCreateRouter, createWebHashHistory, Router } from 'vue-router'

interface ModuleRouter {
    default?: (router: Router) => void
    order?: number
}

export function createRouter() {
    const router = baseCreateRouter({
        history: createWebHashHistory(),
        routes: [],
    })

    const modulesRouter = import.meta.glob<Record<string, ModuleRouter>>('@modules/**/router.ts', {
        eager: true,
    })

    Object.entries(modulesRouter)
        .filter(([, r]) => !!r.default)
        .sort(
            ([, a]: [string, ModuleRouter], [, b]: [string, ModuleRouter]) =>
                (a.order || 99) - (b.order || 99)
        )
        .forEach(([name, r]: [string, ModuleRouter]) => {
            console.debug(`[app] router ${name} loaded`)

            r.default!(router)
        })

    return router
}

export default (app: App) => {
    const router = createRouter()

    app.use(router)
}
