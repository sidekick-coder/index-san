<script setup lang="ts">
import { usePageMeta } from '@/composables/page-meta'
import { useOptionStore } from '@/stores/options'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const store = useOptionStore()
const route = useRoute()
const meta = usePageMeta()

const menuItem = computed(() => store.menuItems.find(i => i.to === route.path))

async function toggleFavorite() {
    const workspaceId = route.params.workspaceId as string


    if (menuItem.value) {
        await store.removeFavorite(menuItem.value)
        return
    }
    
    await store.addFavorite({
        workspaceId,
        label: meta.value.title,
        to: route.path,   
    })
}

</script>

<template>
    <w-layout>
        <is-sidebar />

        <w-content class="bg-zinc-900 text-white">      
            <w-layout use-percentage>
                <w-toolbar class="px-5" :height="60">
                    <div class="text-2xl"> {{ meta.title }} </div>

                    <i class="ml-auto cursor-pointer" @click="toggleFavorite">
                        <fa-icon :icon="menuItem ? 'star' : 'fa-regular fa-star'" />
                    </i>
                </w-toolbar>

                <w-content>
                    <slot></slot>
                </w-content>
            </w-layout>

        </w-content>
    </w-layout>
</template>