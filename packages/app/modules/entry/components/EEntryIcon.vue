<script setup lang="ts">
import DirectoryEntry from '@index-san/core/entities/directory-entry'
import { PropType, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [Object, String] as PropType<DirectoryEntry | string>,
        default: null,
    },
})

const icon = computed(() => {
    let entry = props.modelValue

    if (!entry) return 'file'

    if (typeof entry === 'string') {
        entry = DirectoryEntry.file(entry)
    }

    if (entry.name === '.is') {
        return 'cog'
    }

    if (entry.type === 'directory') {
        return 'folder'
    }

    const ext = DirectoryEntry.extname(entry.path)

    if (['jpeg'].includes(ext)) {
        return 'image'
    }

    if (['md'].includes(ext)) {
        return 'fa-brands fa-markdown'
    }

    if (['html'].includes(ext)) {
        return 'fa-brands fa-html5'
    }

    if (['csv'].includes(ext)) {
        return 'fa-file-csv'
    }

    if (['js', 'ts'].includes(ext)) {
        return 'fa-brands fa-js'
    }

    return 'file'
})

const color = computed(() => {
    let entry = props.modelValue

    if (!entry) return 'text-t-primary'

    if (typeof entry === 'string') {
        entry = DirectoryEntry.file(entry)
    }

    if (entry.name === '.is') {
        return 'text-info'
    }

    if (entry.type === 'directory') {
        return 'text-info'
    }

    const ext = DirectoryEntry.extname(entry.path)

    if (['html'].includes(ext)) {
        return 'text-danger'
    }

    if (['ts'].includes(ext)) {
        return 'text-info'
    }

    return 'text-t-primary'
})
</script>
<template>
    <v-icon :name="icon" :class="color" />
</template>
