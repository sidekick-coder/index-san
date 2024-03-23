import HephaestusEditor from "./components/HephaestusEditor.vue"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware }) {
        addAppPage({
            name: 'hephaestus-editor',
            component: HephaestusEditor,
        })


        addEntryMiddleware({
            handle: ({ entry }) => {

                if (entry.path.endsWith('.hph')) {
                    return {
                        page: 'hephaestus-editor',
                        props: {
                            path: entry.path,
                        }
                    }
                }

                return null
            }
        })
    }
})