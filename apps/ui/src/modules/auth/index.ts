export default defineAppModule({
    async setup({ addMenuItem, addRoute }){

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
            to: {
                name: 'settings'
            } 
        })

        onHook('workspace:loaded', load)

    }
})
