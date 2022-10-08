<script setup lang="ts">
import { useOptionStore } from '@/stores/options'
import { computed, onMounted } from 'vue'
import get from 'lodash/get'

interface Item {
    id: string,
    label: string
    to: string
}


const store = useOptionStore()

const items = computed<Item[]>(() => {
    return store.options
        .reduce((result, o) => result.concat(get(o, 'value.menu.items', [])), [])
})



store.load()

</script>

<template>
    <w-drawer class="bg-zinc-800 text-white border-r border-zinc-700" >
        
        <div class="flex flex-wrap items-start">
            <router-link to="/" class="sidebar-list-item">
                <h1 class="text-lg font-bold">Index-san</h1>
            </router-link>
            
            <router-link to="/workspaces" class="sidebar-list-item clickable text-sm">
                <i class="mr-2"> <fa-icon icon="cubes" /></i>
                <div>Workspaces</div>
            </router-link>
        </div>

        <div class="flex flex-wrap items-start">
            <div class="sidebar-list-item text-gray-500 text-sm font-bold">Favorites</div>

            <div v-if="!items.length" class="sidebar-list-item text-xs">
                No items
            </div>

            <router-link
                v-for="(item, index) in store.menuItems"
                :key="index"
                :to="item.to"
                class="sidebar-list-item clickable text-sm"
            >
                <i class="mr-2 text-[8px] text-teal-500"> <fa-icon icon="circle" /></i>
                <div>{{item.label}}</div>
            </router-link>
        </div>

    </w-drawer>
</template>

<style>
    .sidebar-list-item {
        @apply px-4 py-2 w-full flex items-center;
    }
    
    .sidebar-list-item.clickable {
        @apply hover:bg-gray-800
    }
</style>