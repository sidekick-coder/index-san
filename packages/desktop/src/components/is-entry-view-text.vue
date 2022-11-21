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
const root = ref<HTMLTextAreaElement>()

const decoder = new TextDecoder('utf-8')

const content = ref('')
const indentation = '    '

async function load() {
    const contentBuffer = await repository.read(props.path)

    content.value = decoder.decode(contentBuffer)
}

load()

const onChange = debounce(async () => {
    await repository.write(props.path, content.value)
}, 1000)

watch(content, onChange)

function onTabPress(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement

    if (!textarea) return

    const index = textarea.selectionStart

    const startText = content.value.slice(0, index)
    const endText = content.value.slice(index)

    textarea.value = [startText, indentation, endText].join('')
    content.value = [startText, indentation, endText].join('')

    textarea.selectionEnd = index + indentation.length
    textarea.selectionStart = index + indentation.length
}

function onShiftTabPress(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement

    if (!textarea) return

    const index = textarea.selectionStart
    const isIndentation = content.value.slice(index - indentation.length, index) === indentation

    const startText = content.value.slice(0, index - indentation.length)
    const endText = content.value.slice(index)

    if (!isIndentation) return

    textarea.value = [startText, endText].join('')
    content.value = [startText, endText].join('')

    textarea.selectionEnd = index - indentation.length
    textarea.selectionStart = index - indentation.length
}
</script>
<template>
    <textarea
        ref="root"
        v-model="content"
        class="h-[calc(100%_-_10px)] w-full bg-transparent outline-none"
        autofocus
        spellcheck
        @keydown.exact.tab.prevent="onTabPress"
        @keydown.shift.tab.prevent="onShiftTabPress"
    >
    </textarea>
</template>
