import Directory from "./components/Directory.vue"
import { directoryEntryMiddleware } from "./directoryEntryMiddleware"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware }) {
        addAppPage({
            name: 'directory',
            component: Directory,
        })


        addEntryMiddleware(directoryEntryMiddleware)
    }
})