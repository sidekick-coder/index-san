export default defineAppModule({
    setup({ addRoute }) {
        addRoute({
            path: '/app-page/:name',
            component: () => import('./pages/AppPage.vue'),
        })
    }
})