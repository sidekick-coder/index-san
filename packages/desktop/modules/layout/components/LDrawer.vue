<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import Menu from '@core/entities/menu'

import { useStore } from '@store/global'

import { useToggleDrawer } from '../composables/drawer'

import VDraggable from 'vuedraggable'

const LDrawerItem = defineAsyncComponent(() => import('./LDrawerItem.vue'))

const drawer = useToggleDrawer()

// menu
const tm = useI18n()
const store = useStore()

const dragOptions = {
    emptyInsertThreshold: 22,
    itemKey: 'id',
    group: 'menu',
    ghostClass: 'ghost',
}

const defaultItems: Menu[] = [
    {
        label: tm.t('workspace', 2),
        to: '/workspaces',
        children: [],
        id: 'workspaces',
        icon: 'cubes',
    },
    {
        label: tm.t('collection', 2),
        to: '/collections',
        children: [],
        id: 'collections',
        icon: 'database',
    },
    {
        label: tm.t('entry', 2),
        to: '/entries',
        children: [],
        id: 'entries',
        icon: 'folder',
    },
    {
        label: tm.t('option', 2),
        to: '/options',
        children: [],
        id: 'options',
        icon: 'cog',
    },
]

// title

const title = computed(() => {
    if (store.workspace.current) {
        return store.workspace.current.name
    }

    return 'Index-san'
})

async function onUpdate() {
    await store.menu.save()
}
</script>

<template>
    <v-layout-drawer
        v-model="drawer"
        class="bg-b-secondary text-t-primary border-r border-b-primary group"
    >
        <v-list-item class="pl-7 border-b border-lines">
            <h1 class="text-lg font-bold mr-auto">
                {{ title }}
            </h1>
            <v-btn
                mode="text"
                class="opacity-0 group-hover:opacity-100"
                size="sm"
                @click.prevent.stop="drawer = false"
            >
                <v-icon name="chevron-left" />
            </v-btn>
        </v-list-item>

        <l-drawer-item v-for="item in defaultItems" :key="item.id" :item="item" />

        <v-draggable v-model="store.menu.menu" v-bind="dragOptions" @update="onUpdate">
            <template #item="{ index }">
                <div>
                    <l-drawer-item
                        :item="store.menu.menu[index]"
                        :drag-options="dragOptions"
                        @update="onUpdate"
                    />
                </div>
            </template>
        </v-draggable>
    </v-layout-drawer>
</template>

<style>
.ghost {
    @apply border-t border-accent;
}
</style>
