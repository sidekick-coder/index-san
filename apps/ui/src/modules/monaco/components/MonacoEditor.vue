<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { createEditor, type EditorOptions } from '@/modules/monaco/composables/createEditor'

// editor
const language = defineProp<string>('language', {
    type: String,
    default: 'plaintext',
})

const lineNumbers = defineProp<EditorOptions['lineNumbers']>('lineNumbers', {
    type: String,
    default: 'on',
})

const lineDecorationsWidth = defineProp<EditorOptions['lineDecorationsWidth']>('lineDecorationsWidth', {
    type: Number,
    default: undefined,
})

const folding = defineProp<EditorOptions['folding']>('folding', {
    type: Boolean,
    default: true,
})

const minimap = defineProp<EditorOptions['minimap']>('minimap', {
    type: Object,
    default: () => ({
        enabled: false,
    }),
})
const readonly = defineProp<boolean>('readonly', {
    type: Boolean,
    default: false
})

const scrollbar = defineProp<EditorOptions['scrollbar']>('scrollbar', {
    type: Object,
    default: () => ({
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        useShadows: false,
        horizontal: 'visible',
        vertical: 'visible',
    }),
})

const autofocus = defineProp<boolean>('autofocus', {
    type: Boolean,
    default: false,
})

const model = defineModel({
    type: String,
    default: ''
})

const root = ref<HTMLElement>()
const editorRef = ref<HTMLElement>()

let editor: ReturnType<typeof createEditor>

const emit = defineEmits(['blur'])

function setEditor(){
    if (!editorRef.value) return

    editor = createEditor(editorRef.value!, {
        value: model.value,
        language: language.value,
        overviewRulerBorder: false,
        theme: 'default',
        trimAutoWhitespace: false,
        lineNumbers: lineNumbers.value,
        minimap: minimap.value,
        folding: folding.value,
        scrollbar: scrollbar.value,
        lineDecorationsWidth: lineDecorationsWidth.value,
        readOnly: readonly.value,
    })

    editor.getModel()?.onDidChangeContent(() => (model.value = editor.getValue()))

    if (autofocus) {
        editor.focus()
    }

    editor.onDidBlurEditorWidget(() => {
        emit('blur')
    })
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
