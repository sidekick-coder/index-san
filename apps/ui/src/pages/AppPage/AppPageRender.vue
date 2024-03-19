<script lang="ts" setup>

import type { AppPage } from '@/composables/defineAppPage'
import { directoryAppPage } from '@/modules/directory/directoryAppPage';
import { textEditorAppPage } from '@/modules/text-editor/textEditorAppPage';

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
    textEditorAppPage
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
