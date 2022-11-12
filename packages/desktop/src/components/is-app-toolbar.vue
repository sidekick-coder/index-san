<script setup lang="ts">
import uuid from 'uuid-random'

import { saveWorkspaceMenu, useWorkspaceMenu } from '@/composables/menu'
import { usePageMeta } from '@/composables/page-meta'
import { useState } from '@/composables/state'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    title: {
        type: String,
        required: false,
    }
})

const route = useRoute()
const meta = usePageMeta()

const drawer = useState('app:drawer', true)
const workspaceId = computed(() => route.params.workspaceId)

const menu = computed(() => {
    if (!route.params.workspaceId) return []

    return useWorkspaceMenu(route.params.workspaceId as string).value
})

const item = computed(() => menu.value.find(i => i.to === route.path))

const label = computed(() => {
    if (props.title) return props.title

    return meta.value.title
})

const history = computed(() => window.history.state)

async function toggleFavorite() {
    
    const items = menu.value.slice()

    const index = items.findIndex(i => i.id === item.value?.id)

    if (index !== -1) {
        items.splice(index, 1)
    }
    
    if (index === -1) {
        items.push({
            label: label.value,
            to: route.path,
            order: 10,
            id: uuid()
        })
    }


    await saveWorkspaceMenu(route.params.workspaceId as string, items)
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
            v-if="workspaceId"
            :name="item ? 'star' : 'fa-regular fa-star'"
            class="ml-auto cursor-pointer"
            @click="toggleFavorite"
        />
    </w-toolbar>
</template>