<script setup lang="ts">
import uuid from 'uuid-random'

import { saveWorkspaceMenu, useWorkspaceMenu } from '@/composables/menu'
import { usePageMeta } from '@/composables/page-meta'
import { useState } from '@/composables/state'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspace } from '@/composables/workspaces'

const props = defineProps({
    title: {
        type: String,
        default: null,
    },
})

const route = useRoute()
const meta = usePageMeta()

const [workspace, setWorkspace] = useWorkspace()

const drawer = useState('app:drawer', true, { localStorage: true })
const haveForward = ref(!!window.history.state.forward)
const haveBack = ref(!!window.history.state.back)

const workspaceId = computed(() => route.params.workspaceId)

const menu = computed(() => {
    if (!route.params.workspaceId) return []

    return useWorkspaceMenu(route.params.workspaceId as string).value
})

const item = computed(() => menu.value.find((i) => i.to === route.path))

const label = computed(() => {
    if (props.title) return props.title

    return meta.value.title
})

const links = computed(() => {
    const result = [{ label: label.value, to: '' }]

    if (workspace.value) {
        result.unshift({
            label: workspace.value.name,
            to: `/workspaces/${workspace.value.id}/entries`,
        })
    }

    return result
})

async function toggleFavorite() {
    const items = menu.value.slice()

    const index = items.findIndex((i) => i.id === item.value?.id)

    if (index !== -1) {
        items.splice(index, 1)
    }

    if (index === -1) {
        items.push({
            label: label.value,
            to: route.path,
            order: 10,
            id: uuid(),
        })
    }

    await saveWorkspaceMenu(route.params.workspaceId as string, items)
}

watch(
    () => route.fullPath,
    async () => {
        haveBack.value = !!window.history.state.back
        haveForward.value = !!window.history.state.forward

        if (!workspaceId.value) {
            workspace.value = null
        }

        if (workspaceId.value) {
            await setWorkspace(workspaceId.value as string)
        }
    },
    { immediate: true }
)
</script>

<template>
    <w-toolbar class="px-10 border-b border-gray-700 text-sm" :height="40">
        <is-icon v-if="!drawer" name="bars" class="mr-4 cursor-pointer" @click="drawer = true" />

        <is-icon
            name="arrow-left"
            class="mr-2"
            :class="haveBack ? 'cursor-pointer' : 'text-gray-500'"
            @click="$router.go(-1)"
        />

        <is-icon
            name="arrow-right"
            class="mr-4"
            :class="haveForward ? 'cursor-pointer' : 'text-gray-500'"
            @click="$router.go(1)"
        />

        <template v-for="(link, index) in links" :key="index">
            <router-link v-if="link.to" class="text-sm" :to="link.to">
                {{ link.label }}
            </router-link>

            <div v-else class="text-sm">
                {{ link.label }}
            </div>

            <div v-if="index !== links.length - 1" class="mx-2">/</div>
        </template>

        <is-icon
            v-if="workspaceId"
            :name="item ? 'star' : 'fa-regular fa-star'"
            class="ml-auto cursor-pointer"
            @click="toggleFavorite"
        />
    </w-toolbar>
</template>
