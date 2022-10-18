<script lang="ts" setup>
import { computed, ref } from 'vue'
import debounce from 'lodash/debounce'

import { useDirectoryEntry } from '@/composables/directory-entry'

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
const content = ref({})

async function load(){
    const arrayBuffer = await repository.read(props.path)

    const json = decoder.decode(arrayBuffer)

    content.value = JSON.parse(json)
}

load()

const onSave = debounce(async (data: any) => {    
    await repository.write(props.path, JSON.stringify(data))
}, 1000)


</script>
<template>
    <is-editorjs
        class="pb-5"
        :content="content"
        @save="onSave"
    />
</template>