<script setup lang="ts">
import { computed } from 'vue'
import groupBy from 'lodash/groupBy'

import { useState } from '@/composables/state'
import { useStore as useMenu } from '@/modules/menu/store'
import { useStore as useWorkspace } from '@/modules/workspace/store'

import LDrawerItem from './LDrawerItem.vue'
import { useI18n } from 'vue-i18n'
import Menu from '@core/entities/menu'

const drawer = useState('app:drawer', true, {
    localStorage: true,
})

// menu
const tm = useI18n()
const menuStore = useMenu()

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
        {
            label: tm.t('collection', 2),
            to: '/collections',
            children: [],
            id: 'collections',
            icon: 'database',
        },
        {
            label: tm.t('script', 2),
            to: '/scripts',
            children: [],
            id: 'scripts',
            icon: 'code',
        },
    ]

    return result.concat(menuStore.menu)
})

// title

const workspaceStore = useWorkspace()

const title = computed(() => {
    if (workspaceStore.current) {
        return workspaceStore.current.name
    }

    return 'Index-san'
})
</script>

<template>
    <w-drawer
        v-model="drawer"
        class="bg-b-secondary text-t-primary border-r border-b-primary group"
    >
        <is-list-item to="/" class="pl-7 border-b border-lines">
            <h1 class="text-lg font-bold mr-auto">
                {{ title }}
            </h1>
            <v-btn
                text
                class="opacity-0 group-hover:opacity-100"
                size="sm"
                @click.prevent.stop="drawer = false"
            >
                <is-icon name="chevron-left" />
            </v-btn>
        </is-list-item>

        <l-drawer-item v-for="(item, index) in items" :key="index" :item="item" />
    </w-drawer>
</template>
