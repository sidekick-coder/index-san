<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'

import DirectoryEntry from '@index-san/core/entities/directory-entry'

import { useStore } from '@modules/entry/store'

import MEditor from '@modules/editor/components/Editor.vue'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
    hideActions: {
        type: Boolean,
        default: false,
    },
})

// set content
const store = useStore()

const loading = ref(false)
const content = ref('')

async function setContent() {
    loading.value = true

    const decoder = new TextDecoder('utf-8')

    const contentBuffer = await store.read({
        path: props.path,
    })

    if (!contentBuffer) return

    content.value = decoder.decode(contentBuffer)

    loading.value = false
}

const save = debounce(async () => {
    await store.write({
        data: DirectoryEntry.encode(content.value),
        path: props.path,
    })
}, 1000)

watch(() => props.path, setContent, {
    immediate: true,
})

watch(content, save)

// save

// mode
const tm = useI18n()

const mode = ref('edit')

const modeLabels: Record<typeof mode.value, string> = {
    'edit': tm.t('editMode'),
    'side-by-side': tm.t('sideBySide'),
    'view': tm.t('view'),
}
</script>
<template>
    <m-editor v-if="!loading" v-model="content" />
</template>
