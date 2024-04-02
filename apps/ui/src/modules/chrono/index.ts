import ChronoDashboard from './pages/ChronoDashboard.vue'
import ChronoSidebar from './components/ChronoSidebar.vue'
import ChronoCommitListSidebar from './components/ChronoCommitListSidebar.vue'

export default defineAppModule({
    setup({ addRoute, addMenuItem }) {
        // addRoute({
        //     path: '/chrono',
        //     component: ChronoDashboard,
        // })

        addMenuItem({
            name: 'Chrono',
            icon: 'heroicons:clock-solid',
            label: 'Chrono',
            component: ChronoSidebar,
        })

        addMenuItem({
            name: 'ChronoCommits',
            icon: 'heroicons:clock',
            label: 'Commits',
            component: ChronoCommitListSidebar,
        })
    }
})