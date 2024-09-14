export default defineAppModule({
    setup({ addRoute }) {
        addRoute('workspace', {
            path: '/workspaces/:workspaceId/entries/:path(.*)*',
			name: 'entry',
            props: true,
            component: () => import('./components/EntryProvider.vue'),
        })
    }
})
