import MonacoEditorAppPage from "./components/MonacoEditorAppPage.vue"
import { monacoEditorEntryMiddleware } from "./monacoEditorEntryMiddleware"


export default defineAppModule({
    async setup({ addAppPage, addEntryMiddleware }) {
        
        // register monaco worker
        await import('@/modules/monaco/services/monaco-sw')

        // register theme
        await import('@/modules/monaco/services/theme-register')

        // register languages
        await import('@/modules/monaco/services/language-register')

        addAppPage({
            name: 'monaco-editor',
            component: MonacoEditorAppPage,
        })

        addEntryMiddleware(monacoEditorEntryMiddleware)
    }
})