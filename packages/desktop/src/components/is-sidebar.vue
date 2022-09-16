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
        
        <div class="list-item">
            <h2 class="text-sm">
                Workspaces
            </h2>
        </div>

        <router-link
            v-for="item in workspace.all"
            class="list-item"
            :key="item.id"
            :to="`/workspaces/${item.id}/directory-entries`"
        >
            {{ item.name }}
        </router-link>
        
        <router-link
            class="list-item"
            to="/404"
        >
            404
        </router-link>

    </w-drawer>
</template>

<style>
    .list-item {
        @apply px-4 py-2;
    }
</style>