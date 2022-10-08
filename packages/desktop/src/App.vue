<script setup lang="ts">

import { computed, defineAsyncComponent, watch } from 'vue'
import { providePageMeta } from '@/composables/page-meta'
import { useRoute } from 'vue-router'

const meta = providePageMeta()
const route = useRoute()

const layouts: Record<string, any> = {
    default: defineAsyncComponent(() => import('@/layouts/default.vue')),
    workspace: defineAsyncComponent(() => import('@/layouts/workspace.vue')),
}

const currentLayout = computed(() => meta.value.layout as string || 'default')

function load(){
    meta.value.layout = 'default'
}

watch(() => route.path, load)

</script>
<template>
    <component :is="layouts[currentLayout] || layouts.default">
        <router-view />
    </component>
    
</template>