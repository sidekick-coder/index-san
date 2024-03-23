import { definePlugin } from '@composables/define-helpers'
import type { StartupFn } from '@composables/define-helpers'

export default definePlugin(async (app) => {
    const modulesRouter = import.meta.glob('@modules/**/start.ts', {
        eager: true,
    })

    Promise.all(
        Object.values<any>(modulesRouter)
            .filter((m) => !!m.default)
            .map((m) => m.default || m)
            .map(async (fn: StartupFn) => await fn(app))
    )
})
