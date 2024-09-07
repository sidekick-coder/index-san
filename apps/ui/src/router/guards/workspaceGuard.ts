import type { NavigationGuard } from "vue-router"

export const workspaceGuard: NavigationGuard = async (to, _from, next) => {
	if (!$workspace.id) await loadLastWorkspace()

    const { isLoaded } = useDrive()

    if (!isLoaded.value && to.name !== 'WorkspaceSelector') {
        return next({ name: 'WorkspaceSelector' })
    }

    return next()

}
