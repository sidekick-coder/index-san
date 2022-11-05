<script setup lang="ts">
import { usePageMeta } from '@/composables/page-meta'
import { useState } from '@/composables/state'
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

const drawer = useState('app:drawer', true)

const menuItem = computed(() => store.menuItems.find(i => i.to === route.path))

const label = computed(() => {
    if (props.title) return props.title

    return meta.value.title
})

const history = computed(() => window.history.state)

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
    <w-toolbar class="px-10 border-b border-gray-700 text-sm" :height="40">
        <is-icon            
            v-if="!drawer"
            name="bars"
            class="mr-4 cursor-pointer"
            @click="drawer = true"
        />

        <is-icon            
            name="arrow-left"
            class="mr-2"
            :class="history.back ? 'cursor-pointer' : 'text-gray-500' "
            @click="$router.go(-1)"
        />
        
        <is-icon
            name="arrow-right"
            class="mr-4 "
            :class="history.forward ? 'cursor-pointer' : 'text-gray-500' "
            @click="$router.go(1)"
        />

        <div class="text-sm"> {{ label }} </div>


        <is-icon
            :name="menuItem ? 'star' : 'fa-regular fa-star'"
            class="ml-auto cursor-pointer"
            @click="toggleFavorite"
        />
    </w-toolbar>
</template>