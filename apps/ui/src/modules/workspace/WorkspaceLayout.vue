<script lang="ts" setup>
const drawer = useLocalStorage('drawer', true)

// general
const route = useRoute()

// workspace
const workspaceId = computed(() => String(route.params.workspaceId))
const { workspaces, load: loadWorkspaces } = useWorkspaces()

if (!workspaces.value.length) {
	await loadWorkspaces()
}

let workspace = workspaces.value.find(w => w.id === workspaceId.value)

if (!workspace) {
	 throw new Error('Workspace not found')	
}

provideCurrentWorkspace(workspace)

// permissions
async function verifyPermission(handle: any) {
	const options = {
		mode: 'readwrite',
	}

	if (await handle.queryPermission(options) === 'granted') {
		return true
	}

	if (handle.requestPermission(options) === 'granted') {
		return true
	}

	return false
}

const permission = await verifyPermission(workspace.handle)

if (!permission) {
	throw new Error('Permission not granted')
}

// drive
const drive = createWorkspaceDrive(workspace!.handle)

provideWorkspaceDrive(drive)

emitHook('workspace:loaded', {
    workspace,
})

// configuration
await loadConfig()

// plugin
await loadActivePlugins()

// menu
const menuItems = useMenuItems()

const activeMenuItem = useLocalStorage('activeMenuItem', '')

const sidebarComponent = computed(() => {
	const item = menuItems.value.find(item => item.name === activeMenuItem.value)

	return item?.component
})
</script>

<template>
    <div class="flex bg-body-700">
        <is-app-drawer-mini
            v-model:drawer="drawer"
            v-model:active-menu-item="activeMenuItem"
        />

        <div
            class="bg-body-800  border-body-500 transition-[width] duration-300 h-dvh overflow-y-auto"
            :class="drawer && sidebarComponent ? 'w-80 border-r' : 'w-0'"
        >
            <component
                :is="item.component"
                v-for="(item, i) in menuItems"
                v-show="item.name === activeMenuItem"
                :key="i"
            />
        </div>

        <div class="flex-1 h-dvh bg-body-700 overflow-hidden">
            <router-view />
        </div>
    </div>
</template>
