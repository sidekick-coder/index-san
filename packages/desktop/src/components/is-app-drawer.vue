<script setup lang="ts">
import { computed } from 'vue'
import groupBy from 'lodash/groupBy'

import { useState } from '@/composables/state'
import { useAllMenu, useAllMenuAsync } from '@/composables/menu'

const drawer = useState('app:drawer', true, {
    localStorage: true,
})
const menu = useAllMenu()

const sections = computed(() => {
    return groupBy(menu.value, (i) => i.section || 'Favorites')
})

if (!menu.value.length) {
    useAllMenuAsync()
}
</script>

<template>
    <w-drawer v-model="drawer" class="bg-zinc-800 text-white border-r border-zinc-700 group">
        <div class="flex flex-wrap items-start">
            <div class="flex items-center w-full justify-between">
                <router-link to="/" class="sidebar-list-item">
                    <h1 class="text-lg font-bold">Index-san</h1>
                </router-link>

                <is-icon
                    name="chevron-left"
                    class="px-4 cursor-pointer opacity-0 group-hover:opacity-100"
                    @click="drawer = false"
                />
            </div>

            <router-link to="/workspaces" class="sidebar-list-item clickable text-sm">
                <i class="mr-2"> <fa-icon icon="cubes" /></i>
                <div>Workspaces</div>
            </router-link>

            <router-link to="/settings/menu" class="sidebar-list-item clickable text-sm">
                <i class="mr-2"> <fa-icon icon="cog" /></i>
                <div>{{ $t('settings') }}</div>
            </router-link>
        </div>

        <div v-for="(items, name) in sections" :key="name" class="flex flex-wrap items-start">
            <div class="sidebar-list-item text-gray-500 text-sm font-bold">{{ name }}</div>

            <router-link
                v-for="(item, index) in items"
                :key="index"
                :to="item.to"
                class="sidebar-list-item clickable text-sm"
            >
                <is-icon :name="item.icon || 'circle'" class="mr-4" />
                <div>{{ item.label }}</div>
            </router-link>
        </div>
    </w-drawer>
</template>

<style>
.sidebar-list-item {
    @apply px-4 py-2 w-full flex items-center;
}

.sidebar-list-item.clickable {
    @apply hover:bg-gray-800;
}
</style>
