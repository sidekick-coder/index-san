<script setup lang="ts">

import { computed, defineAsyncComponent, watch } from 'vue'
import { providePageMeta } from '@/composables/page-meta'
import { useRoute } from 'vue-router'
import { useHooks } from './plugins/hooks'

const meta = providePageMeta()

const hooks = useHooks()

const route = useRoute()

const layouts: Record<string, any> = {
    default: defineAsyncComponent(() => import('@/layouts/default.vue')),
}

const currentLayout = computed(() => meta.value.layout as string || 'default')

function load(){
    meta.value.layout = 'default'
}

watch(() => route.path, load)

hooks.emit('app:boot')

</script>

<template>
    <component :is="layouts[currentLayout] || layouts.default">
        <router-view />
    </component>
    
    <is-item-dialog />
</template>