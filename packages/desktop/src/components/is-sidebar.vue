<script setup lang="ts">
import { ref } from 'vue'
import { useCase } from '../composables/use-case'
import Workspace from '../../../core/entities/workspace'
import WDrawer from 'vue-wind/components/w-drawer/w-drawer.vue'

interface Response {
    data: Workspace[]
}

const items = ref<Workspace[]>([])

useCase<Response>('list-workspaces')
    .then(({ data }) => items.value = data)

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

        <div class="list-item" v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>

    </w-drawer>
</template>

<style>
    .list-item {
        @apply px-4 py-2;
    }
</style>