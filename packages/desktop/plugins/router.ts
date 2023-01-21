import { App } from 'vue'
import { createRouter as baseCreateRouter, createWebHashHistory, Router } from 'vue-router'

interface ModuleRouter {
    default?: (router: Router) => void
}

export function createRouter() {
    const router = baseCreateRouter({
        history: createWebHashHistory(),
        routes: [],
    })

    const modulesRouter = import.meta.glob<Record<string, ModuleRouter>>('@modules/**/router.ts', {
        eager: true,
    })

    Object.values<ModuleRouter>(modulesRouter)
        .filter((m) => !!m.default)
        .forEach((m) => m.default!(router))

    return router
}

export default (app: App) => {
    const router = createRouter()

    app.use(router)
}
