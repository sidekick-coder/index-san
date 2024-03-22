export default defineAppModule({
    setup({ addRoute }) {
        addRoute({
            path: '/hephaestus-editor',
            component: () => import('./pages/AppPage.vue'),
        })
    }
})