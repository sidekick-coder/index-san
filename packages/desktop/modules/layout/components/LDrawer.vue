<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import Menu from '@core/entities/menu'

import { useStore } from '@/store/global'

import { useToggleDrawer } from '../composables/drawer'

const LDrawerItem = defineAsyncComponent(() => import('./LDrawerItem.vue'))

const drawer = useToggleDrawer()

// menu
const tm = useI18n()
const store = useStore()

const items = computed(() => {
    const result: Menu[] = [
        {
            label: tm.t('workspace', 2),
            to: '/workspaces',
            children: [],
            id: 'workspaces',
            icon: 'cubes',
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

    return result.concat(store.menu.menu)
})

// title

const title = computed(() => {
    if (store.workspace.current) {
        return store.workspace.current.name
    }

    return 'Index-san'
})
</script>

<template>
    <v-layout-drawer
        v-model="drawer"
        class="bg-b-secondary text-t-primary border-r border-b-primary group"
    >
        <v-list-item to="/" class="pl-7 border-b border-lines">
            <h1 class="text-lg font-bold mr-auto">
                {{ title }}
            </h1>
            <v-btn
                text
                class="opacity-0 group-hover:opacity-100"
                size="sm"
                @click.prevent.stop="drawer = false"
            >
                <v-icon name="chevron-left" />
            </v-btn>
        </v-list-item>

        <l-drawer-item v-for="item in items" :key="item.id" :item="item" />
    </v-layout-drawer>
</template>
