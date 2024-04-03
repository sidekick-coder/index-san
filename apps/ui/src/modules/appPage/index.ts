import AppPageImage from './components/AppPageImage.vue'
import AppPageVideo from './components/AppPageVideo.vue'

export default defineAppModule({
    setup({ addRoute, addAppPage, addEntryMiddleware }) {
        addRoute({
            path: '/app-page/:name(.*)*',
            component: () => import('./pages/AppPage.vue'),
        })

        addAppPage({
            name: 'app-page-image',
            component: AppPageImage,
        })
        
        addAppPage({
            name: 'app-page-video',
            component: AppPageVideo,
        })

        addEntryMiddleware({
            async handle({ entry }){
                const imageExtensions = ['.jpg', '.png', '.jpeg', '.webp', '.gif']
                const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv']

                if (imageExtensions.some(ext => entry.name.endsWith(ext))) {
                    return {
                        page: 'app-page-image',
                        props: {
                            path: entry.path
                        }
                    }
                }

                if (videoExtensions.some(ext => entry.name.endsWith(ext))) {
                    return {
                        page: 'app-page-video',
                        props: {
                            path: entry.path
                        }
                    }
                }
            }
        })
    }
})