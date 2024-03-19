<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { loadLibs, type MonacoLibs } from '@/composables/useMonaco'

import { editor as monacoEditor } from 'monaco-editor'

// Props & Emits
interface LeftLineOptions {
    show: 'on' | 'off' | 'relative' | 'interval'
    decorationsWidth?: number | string
    numbersMinChars?: number
}

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        default: 'typescript',
    },
    minimap: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    glyphMargin: {
        type: Boolean,
        default: false,
    },
    folding: {
        type: Boolean,
        default: false,
    },
    padding: {
        type: Object as () => monacoEditor.IEditorOptions['padding'],
        default: undefined,
    },
    renderLineHighlight: {
        type: String as () => monacoEditor.IEditorOptions['renderLineHighlight'],
        default: undefined,
    },
    trimAutoWhitespace: {
        type: Boolean,
        default: false,
    },
    scrollbar: {
        type: Object as () => monacoEditor.IEditorScrollbarOptions,
        default: () => ({
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
            horizontal: 'visible',
            vertical: 'visible',
        }),
    },
    lineOptions: {
        type: Object as () => LeftLineOptions,
        default: () => ({
            show: 'on',
        }),
    },
    libs: {
        type: Array as () => MonacoLibs[],
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue'])

const dispose = ref(() => true)

// load libs
onMounted(() => {
    dispose.value = loadLibs(props.libs)
})

onUnmounted(() => {
    dispose.value()
})

// mount editor
const root = ref<HTMLElement>()

let editor: ReturnType<typeof useMonaco>

const model = useVModel(props, 'modelValue', emit)

onMounted(() => {
    if (!root.value) return

    editor = useMonaco(root.value!, {
        value: model.value,
        language: props.language,
        readOnly: props.readonly,
        minimap: { enabled: props.minimap },
        padding: props.padding,
        overviewRulerBorder: false,
        lineNumbers: props.lineOptions.show,
        lineDecorationsWidth: props.lineOptions.decorationsWidth,
        lineNumbersMinChars: props.lineOptions.numbersMinChars,
        glyphMargin: props.glyphMargin,
        folding: props.folding,
        wordWrap: 'on',
        scrollbar: props.scrollbar,
        renderLineHighlight: props.renderLineHighlight,
        trimAutoWhitespace: props.trimAutoWhitespace,
    })

    editor.getModel()?.onDidChangeContent(() => (model.value = editor.getValue()))
})

onUnmounted(() => {
    editor.getModel()?.dispose()
})

watch(
    () => props.modelValue,
    (value) => {
        if (!editor) return

        if (value !== editor.getValue()) {
            editor.setValue(value)
        }
    }
)
</script>
<template>
    <div ref="root" class="w-full h-full"></div>
</template>
