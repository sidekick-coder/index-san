import HephaestusEditor from "./components/HephaestusEditor.vue"

export default defineAppModule({
    setup({ addAppPage, addEntryMiddleware, addRoute }) {

		addRoute({
			path: '/hephaestus/live',
			component: () => import('./pages/HephaestusLive.vue'),
			meta: { layout: 'empty' }
		})

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
