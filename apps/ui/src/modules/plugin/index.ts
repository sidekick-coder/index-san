import PluginListAppPage from './components/PluginListAppPage.vue'
import PluginSidebar from './components/PluginSidebar.vue'

export default defineAppModule({
    async setup({ addMenuItem }) {
		addAppPage({
			name: 'Plugins',
			component: PluginListAppPage 
		})

        addMenuItem({
            name: 'plugins',
            order: 1,
            label: 'Plugins',
            icon: 'heroicons:square-3-stack-3d-16-solid',
            component: PluginSidebar,
        })
	
    }
})
