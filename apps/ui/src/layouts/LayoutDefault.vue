<script lang="ts" setup>
const drawer = useLocalStorage('drawer', true)

// menu
const menuItems = useMenuItems()

const activeMenuItem = useLocalStorage('activeMenuItem', '')

const sidebarComponent = computed(() => {
    const item = menuItems.value.find(item => item.name === activeMenuItem.value)

    return item?.component
})

// drive

const { isLoaded } = useDrive()

</script>

<template>
    <is-app
        v-if="isLoaded"
        class="flex bg-body-700"
    >
        <is-app-drawer-mini
            v-model:drawer="drawer"
            v-model:active-menu-item="activeMenuItem"
        />

        <div 
            class="bg-body-800  border-body-500 transition-[width] duration-300 h-dvh overflow-y-auto"
            :class="drawer && sidebarComponent ? 'w-80 border-r' : 'w-0'"
        >
            <component
                :is="sidebarComponent"
                v-if="sidebarComponent"
            />
        </div>

        <div class="flex-1 h-dvh bg-body-700 overflow-hidden">
            <slot />
        </div>
    </is-app>
</template>
