<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { providePageMeta } from '@/composables/page-meta'
import { useRoute, useRouter } from 'vue-router'
import { useHooks } from './plugins/hooks'

const meta = providePageMeta()

const hooks = useHooks()

const route = useRoute()
const router = useRouter()

const layouts: Record<string, any> = {
    default: defineAsyncComponent(() => import('@/layouts/default.vue')),
}

const currentLayout = computed(() => (meta.value.layout as string) || 'default')

watch(
    () => route.path,
    (value) => {
        meta.value.layout = 'default'

        localStorage.setItem('app:last-route', value)
    }
)

onMounted(() => {
    const lastRoute = localStorage.getItem('app:last-route')

    if (lastRoute) router.push(lastRoute)

    hooks.emit('app:boot')
})
</script>

<template>
    <component :is="layouts[currentLayout] || layouts.default">
        <router-view />
    </component>
</template>
