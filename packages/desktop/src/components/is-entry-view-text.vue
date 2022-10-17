<script setup lang="ts">
import { useDirectoryEntry } from '@/composables/directory-entry'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

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

const decoder = new TextDecoder('utf-8')

const content = ref('')

async function load(){
    const contentBuffer = await repository.read(props.path)

    content.value = decoder.decode(contentBuffer)
}

load()

const onChange = debounce(async () => {
    await repository.write(props.path, content.value)
}, 1000)

watch(content, onChange)

</script>
<template>
    <textarea
        v-model="content"
        class="h-full w-full bg-transparent outline-none"
        autofocus
    >

    </textarea>
</template>