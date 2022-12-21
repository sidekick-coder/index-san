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

    if (/.(html)/.test(entry.path)) {
        return 'fa-brands fa-html5'
    }

    if (entry.name === '.is') {
        return 'cog'
    }

    if (entry.type === 'directory') {
        return 'folder'
    }

    return 'file'
})

const color = computed(() => {
    let entry = props.modelValue

    if (typeof entry === 'string') {
        entry = DirectoryEntry.file(entry)
    }

    if (/.(html)/.test(entry.path)) {
        return 'text-danger'
    }

    if (entry.type === 'directory') {
        return 'text-info'
    }

    return 'text-t-primary'
})
</script>
<template>
    <v-icon :name="icon" :class="color" />
</template>
