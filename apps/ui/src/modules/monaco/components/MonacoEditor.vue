<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { createEditor } from '@/modules/monaco/composables/createEditor'

// editor
const language = defineProp<string>('language', {
    type: String,
    default: 'plaintext',
})

const model = defineModel({
    type: String,
    default: ''
})

const root = ref<HTMLElement>()
const editorRef = ref<HTMLElement>()

let editor: ReturnType<typeof createEditor>

function setEditor(){
    if (!editorRef.value) return

    editor = createEditor(editorRef.value!, {
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
}

onMounted(setEditor)

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
        class="w-full h-full relative"
    >
        <div
            ref="editorRef"
            class="w-full h-full absolute"
        />
    </div>
</template>
