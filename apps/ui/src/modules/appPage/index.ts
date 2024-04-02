import AppPageImage from './components/AppPageImage.vue'

export default defineAppModule({
    setup({ addRoute, addAppPage, addEntryMiddleware }) {
        addRoute({
            path: '/app-page/:name',
            component: () => import('./pages/AppPage.vue'),
        })

        addAppPage({
            name: 'app-page-image',
            component: AppPageImage,
        })

        addEntryMiddleware({
            async handle({ entry }){
                if (['.jpg', '.png', '.jpeg', '.webp', '.gif'].some(ext => entry.name.endsWith(ext))) {
                    return {
                        page: 'app-page-image',
                        props: {
                            path: entry.path
                        }
                    }
                }
            }
        })
    }
})