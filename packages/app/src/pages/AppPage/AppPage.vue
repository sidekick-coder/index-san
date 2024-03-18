<script lang="ts" setup>

import type { AppPage } from '@/composables/defineAppPage'
import AppPageDirectory from './AppPageDirectory.vue';
import AppPageFile from './AppPageFile.vue';

const name = defineProp('name', {
    type: String,
    required: true
})

const pages = shallowRef<AppPage[]>([
    defineAppPage({ name: 'directory', component: AppPageDirectory }),
    defineAppPage({ name: 'file', component: AppPageFile }),
])

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
