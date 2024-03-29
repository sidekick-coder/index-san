import ChronoDashboard from './pages/ChronoDashboard.vue'	

export default defineAppModule({
    setup({ addRoute }) {
        addRoute({
            path: '/chrono',
            component: ChronoDashboard,
        })
    }
})