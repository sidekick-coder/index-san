<script lang="ts" setup>
import orderBy from 'lodash/orderBy'

// general
const router = useRouter()

// drawer
const drawer = defineModel('drawer', {
    type: Boolean,
    default: false    
})

// menu
const menuItems = useMenuItems()

const activeMenuItem = defineModel('activeMenuItem', {
    type: String,
    default: ''
})

function onItemClick(name: string) {
    if (activeMenuItem.value === name) {
        drawer.value = !drawer.value
        return
    }

    activeMenuItem.value = name
    drawer.value = true
}

function exitWorkspace() {
    router.push('/workspaces')
}
</script>

<template>
    <div class="w-14 min-h-full bg-body-900 border-r border-body-500 shadow">
        <div class="flex flex-col h-full">
            <is-list-item
                justify="center"
                @click="onItemClick('')"
            >
                <is-logo class="w-5 h-5" />
            </is-list-item>

            <is-tooltip
                v-for="(item, i) in orderBy(menuItems, 'order')"
                :key="i"
                placement="right"
            >
                <template #activator="{ attrs }">
                    <is-list-item
                        v-bind="attrs"
                        justify="center"
                        :class="activeMenuItem === item.name ? '!text-primary-300 bg-primary-900/25' : ''"
                        @click="onItemClick(item.name)"
                    >
                        <is-icon
                            :name="item.icon"
                            size="xl"
                        />
                    </is-list-item>
                </template>

                <div>
                    {{ item.label }}
                </div>
            </is-tooltip>
            
            <div class="grow" />

            <is-tooltip placement="right">
                <template #activator="{ attrs }">
                    <is-list-item
                        justify="center"
                        v-bind="attrs"
                        @click="exitWorkspace"
                    >
                        <is-icon
                            name="heroicons:arrow-left-end-on-rectangle-solid"
                            size="xl"
                        />
                    </is-list-item>
                </template>

                <div>
                    Exit workspace
                </div>
            </is-tooltip>
        </div>
    </div>
</template>
