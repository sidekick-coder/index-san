export default defineAppModule({
    async setup({ addMenuItem, addRoute }){

        if (!import.meta.env.VITE_APP_ENABLE_API) return

        const { load } = useAuth()

        addRoute('workspace', {
            name: 'settings',
            path: '/workspaces/:workspaceId/settings',
            component: () => import('@/modules/auth/pages/AuthLogin.vue')
        })

        addMenuItem({
            name: 'settings',
            label: 'Config',
            icon: 'heroicons:cog-6-tooth-16-solid',
            position: "bottom",
            to: {
                name: 'settings'
            } 
        })

        onHook('workspace:loaded', load)

    }
})
