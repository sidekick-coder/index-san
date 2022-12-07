<script setup lang="ts">
import { computed } from 'vue'
import groupBy from 'lodash/groupBy'

import { useState } from '@/composables/state'
import { useStore as useMenu } from '@/modules/menu/store'
import { useStore as useWorkspace } from '@/modules/workspace/store'

const drawer = useState('app:drawer', true, {
    localStorage: true,
})

// menu
const menuStore = useMenu()

const sections = computed(() => {
    return groupBy(menuStore.menu, (i) => i.section || 'Favorites')
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
        <div class="flex flex-wrap items-start">
            <div class="flex items-stretch w-full justify-between">
                <is-list-item to="/">
                    <h1 class="text-lg font-bold">
                        {{ title }}
                    </h1>
                </is-list-item>
                <is-btn
                    text
                    class="opacity-0 h-[52px] group-hover:opacity-100"
                    @click="drawer = false"
                >
                    <is-icon name="chevron-left" />
                </is-btn>
            </div>

            <is-list-item to="/workspaces">
                <i class="mr-2"> <fa-icon icon="cubes" /></i>
                <div>Workspaces</div>
            </is-list-item>

            <is-list-item to="/options">
                <i class="mr-2"> <fa-icon icon="cog" /></i>
                <div>{{ $t('option', 2) }}</div>
            </is-list-item>

            <is-list-item to="/collections">
                <is-icon name="database" class="mr-2" />
                <div>{{ $t('collection', 2) }}</div>
            </is-list-item>

            <is-list-item to="/scripts">
                <is-icon name="code" class="mr-2" />
                <div>{{ $t('script', 2) }}</div>
            </is-list-item>
        </div>

        <div v-for="(items, name) in sections" :key="name" class="flex flex-wrap items-start">
            <is-list-item class="text-t-secondary font-bold">
                {{ name }}
            </is-list-item>

            <is-list-item v-for="(item, index) in items" :key="index" :to="item.to">
                <is-icon :name="item.icon || 'circle'" class="mr-4" />
                <div>{{ item.label }}</div>
            </is-list-item>
        </div>
    </w-drawer>
</template>
