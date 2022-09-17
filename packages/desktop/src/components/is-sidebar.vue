<script setup lang="ts">
import { useWorkspace } from '../stores/workspaces'
import WDrawer from 'vue-wind/components/w-drawer/w-drawer.vue'

const workspace = useWorkspace()

workspace.setAll()

</script>

<template>
    <w-drawer class="bg-zinc-800 text-white" >
        <router-link to="/" class="list-item">
            <h1 class="text-xl font-bold">Index-san</h1>
        </router-link>

        <router-link
            v-for="item in workspace.all"
            class="list-item clickable"
            :key="item.id"
            :to="`/workspaces/${item.id}`"
        >
            <fa-icon icon="folder" class="mr-2" />

            {{ item.name }}
        </router-link>

    </w-drawer>
</template>

<style>
    .list-item {
        @apply px-4 py-2 ;
    }
    
    .list-item.clickable {
        @apply hover:bg-gray-700
    }
</style>