import DirectoryAppPage from "./components/DirectoryAppPage.vue"
import DirectorySidebar from "./components/DirectorySidebar.vue"
import DirectoryRootSidebar from "./components/DirectoryRootSidebar.vue"
import { directoryEntryMiddleware } from "./directoryEntryMiddleware"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware, addMenuItem }) {
        addAppPage({
            name: 'directory',
            component: DirectoryAppPage,
        })

        addEntryMiddleware(directoryEntryMiddleware)

        addMenuItem({
            name: 'directory-root',
            order: 1,
            label: 'Root',
            icon: 'heroicons:home-solid',
            component: DirectoryRootSidebar,
        })

        addMenuItem({
            name: 'directory',
            order: 1,
            label: 'Directory',
            icon: 'heroicons:folder-solid',
            component: DirectorySidebar,
        })

    }
})
