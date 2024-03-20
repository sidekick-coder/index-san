<script lang="ts" setup>

import type { AppPage } from '@/composables/defineAppPage'
import { directoryAppPage } from '@/modules/directory/directoryAppPage';
import { monacoEditorAppPage } from '@/modules/monaco/monacoEditorAppPage';

const name = defineProp('name', {
    type: String,
    required: true
})

const pageProps = defineProp<Record<string, any>>('pageProps', {
    type: Object,
    default: () => ({})
})

const pages = shallowRef<AppPage[]>([
    directoryAppPage,
    monacoEditorAppPage
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
    <component
        :is="currentComponent"
        v-if="currentComponent"
        v-bind="pageProps"
    />

    <div
        v-else
        class="min-h-full w-full flex items-center justify-center"
    >
        No page found
    </div>
</template>
