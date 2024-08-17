import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    await loadLastWorkspace()

    const { isLoaded } = useDrive()

    if (!isLoaded.value && to.name !== 'WorkspaceSelector') {
        return next({ name: 'WorkspaceSelector' })
    }

    return next()
})

export default router

