import DirectoryAppPage from "./components/DirectoryAppPage.vue"
import DirectorySidebar from "./components/DirectorySidebar.vue"
import { directoryEntryMiddleware } from "./directoryEntryMiddleware"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware, addMenuItem }) {
        addAppPage({
            name: 'directory',
            component: DirectoryAppPage,
        })

        addEntryMiddleware(directoryEntryMiddleware)

        addMenuItem({
            name: 'directory',
            label: 'Directory',
            icon: 'heroicons:folder-solid',
            component: DirectorySidebar,
        })
    }
})