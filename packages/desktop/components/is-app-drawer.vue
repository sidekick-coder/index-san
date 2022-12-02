<script setup lang="ts">
import { computed } from 'vue'
import groupBy from 'lodash/groupBy'

import { useState } from '@/src/composables/state'
import { useAllMenu, useAllMenuAsync } from '@/src/composables/menu'

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
    <w-drawer
        v-model="drawer"
        class="bg-b-secondary text-t-primary border-r border-b-primary group"
    >
        <div class="flex flex-wrap items-start">
            <div class="flex items-stretch w-full justify-between">
                <is-list-item to="/">
                    <h1 class="text-lg font-bold">Index-san</h1>
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

            <is-list-item to="/settings">
                <i class="mr-2"> <fa-icon icon="cog" /></i>
                <div>{{ $t('settings') }}</div>
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
