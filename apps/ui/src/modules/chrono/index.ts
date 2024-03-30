import ChronoDashboard from './pages/ChronoDashboard.vue'
import ChronoSidebar from './components/ChronoSidebar.vue'

export default defineAppModule({
    setup({ addRoute, addMenuItem }) {
        addRoute({
            path: '/chrono',
            component: ChronoDashboard,
        })

        addMenuItem({
            name: 'Chrono',
            icon: 'heroicons:clock-solid',
            label: 'Chrono',
            component: ChronoSidebar,
        })
    }
})