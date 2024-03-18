<script lang="ts" setup>

import type { AppPage } from '@/composables/defineAppPage'
import Directory from './AppPageDirectory.vue';

const name = defineProp('name', {
    type: String,
    required: true
})

const pages = shallowRef<AppPage[]>([])

const directoryPage = defineAppPage({
    name: 'directory',
    component: Directory,
})

pages.value.push(directoryPage)

const current = computed(() => pages.value.find(p => p.name === name.value))

const currentComponent = computed(() => {
    if (!current.value) {
        return null
    }

    return current.value.component
})

</script>

<template>
    <component v-if="currentComponent" :is="currentComponent" />

    <div v-else>
        No page found
    </div>
</template>
