import ChronoSidebar from './components/ChronoSidebar.vue'
import ChronoFileHistoryAppPage from './components/ChronoFileHistoryAppPage.vue'
import ChronoCommitListSidebar from './components/ChronoCommitListSidebar.vue'

export default defineAppModule({
    setup({ addMenuItem, addAppPage }) {

        addAppPage({
            name: 'chrono/file-history',
            component: ChronoFileHistoryAppPage,
        })

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

        onHook('drive:write', async ({ path }) => createCommitFromPath(path))
        onHook('drive:destroy', async ({ path }) => createCommitFromPath(path))
        onHook('drive:move', async ({ from, to }) => {
            await createCommitFromPath(from)
            await createCommitFromPath(to)
        })
    }
})