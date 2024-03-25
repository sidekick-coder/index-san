<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { createEditor } from '@/modules/monaco/composables/createEditor'

// editor
const language = defineProp<string>('language', {
    type: String,
    default: 'plaintext',
})

const hideLineNumbers = defineProp<boolean>('hideLineNumbers', {
    type: Boolean,
    default: false,
})

const model = defineModel({
    type: String,
    default: ''
})

const root = ref<HTMLElement>()

let editor: ReturnType<typeof createEditor>

onMounted(() => {
    if (!root.value) return

    editor = createEditor(root.value!, {
        value: model.value,
        language: language.value,
        overviewRulerBorder: false,
        theme: 'default',
        trimAutoWhitespace: false,
        minimap: {
            enabled: false,
        },
        scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
            horizontal: 'visible',
            vertical: 'visible',
        },
    })

    editor.getModel()?.onDidChangeContent(() => (model.value = editor.getValue()))
})

onUnmounted(() => {
    editor.getModel()?.dispose()
})

watch(model,
    (value) => {
        if (!editor) return

        if (value !== editor.getValue()) {
            editor.setValue(value)
        }
    }
)
</script>
<template>
    <div
        ref="root"
        class="w-full h-full"
    />
</template>
