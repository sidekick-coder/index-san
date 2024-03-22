import MonacoEditorAppPage from "./components/MonacoEditorAppPage.vue"
import { monacoEditorEntryMiddleware } from "./monacoEditorEntryMiddleware"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware }) {
        addAppPage({
            name: 'monaco-editor',
            component: MonacoEditorAppPage,
        })


        addEntryMiddleware(monacoEditorEntryMiddleware)
    }
})