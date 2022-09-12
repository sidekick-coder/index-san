<script setup lang="ts">
import { ref } from 'vue'
import { useCase } from '../composables/use-case'
import { useWorkspace } from '../stores/workspaces'
import Workspace from '../../../core/entities/workspace'
import WDrawer from 'vue-wind/components/w-drawer/w-drawer.vue'

interface Response {
    data: Workspace[]
}

const workspace = useWorkspace()

workspace.setAll()

</script>

<template>
    <w-drawer class="bg-zinc-800 text-white" >
        <div class="list-item">
            <h1 class="text-xl font-bold">Index-san</h1>
        </div>
        
        <div class="list-item">
            <h2 class="text-sm">
                Workspaces
            </h2>
        </div>

        <router-link
        v-for="item in workspace.all"
            class="list-item"
            :key="item.id"
            :to="`/workspaces/${item.id}`"
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