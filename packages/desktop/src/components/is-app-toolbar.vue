<script setup lang="ts">
import { usePageMeta } from '@/composables/page-meta'
import { useOptionStore } from '@/stores/options'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    title: {
        type: String,
        required: false,
    }
})

const store = useOptionStore()
const route = useRoute()
const meta = usePageMeta()

const menuItem = computed(() => store.menuItems.find(i => i.to === route.path))

const label = computed(() => {
    if (props.title) return props.title

    return meta.value.title
})

async function toggleFavorite() {
    const workspaceId = route.params.workspaceId as string

    if (menuItem.value) {
        await store.removeFavorite(menuItem.value)
        return
    }
    
    await store.addFavorite({
        workspaceId,
        label: label.value,
        to: route.path,   
    })
}

</script>

<template>
    <w-toolbar class="px-10" :height="60">
        <div class="text-2xl"> {{ label }} </div>

        <i class="ml-auto cursor-pointer" @click="toggleFavorite">
            <fa-icon :icon="menuItem ? 'star' : 'fa-regular fa-star'" />
        </i>
    </w-toolbar>
</template>