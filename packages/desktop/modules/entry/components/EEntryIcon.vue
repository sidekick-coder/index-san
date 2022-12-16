<script setup lang="ts">
import DirectoryEntry from '@/../core/entities/directory-entry'
import { PropType, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [Object, String] as PropType<DirectoryEntry | string>,
        default: null,
    },
})

const icon = computed(() => {
    let entry = props.modelValue

    if (typeof entry === 'string') {
        entry = DirectoryEntry.file(entry)
    }

    if (/.(jpeg)/.test(entry.path)) {
        return 'image'
    }

    if (/.(md)/.test(entry.path)) {
        return 'fa-brands fa-markdown'
    }

    if (entry.name === '.is') {
        return 'cog'
    }

    if (entry.type === 'directory') {
        return 'folder'
    }

    return 'file'
})
</script>
<template>
    <is-icon :name="icon" />
</template>
