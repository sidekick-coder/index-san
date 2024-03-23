export default defineAppModule({
    setup({ addRoute }) {
        addRoute({
            path: '/entries/:path(.*)*',
            props: true,
            component: () => import('./pages/EntryProvider.vue'),
        })
    }
})