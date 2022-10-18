<script lang="ts" setup>
import { useDirectoryEntry } from '@/composables/directory-entry'
import { computed, ref } from 'vue'
import mime from 'mime'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})
const repository = useDirectoryEntry(props.workspaceId)

const src = ref<string>()

async function load(){
    const arrayBuffer = await repository.read(props.path)

    const base64 = window.btoa(arrayBuffer.reduce((data, b) => data + String.fromCharCode(b), ''))

    const type = mime.getType(props.path)

    src.value = `data:${type};base64, ${base64}`
}

load()


</script>
<template>
    <img
        v-if="src" :src="src" :alt="path"
        class="w-full h-full object-contain"
    >
</template>