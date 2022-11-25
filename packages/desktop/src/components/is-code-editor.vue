<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import defaultTheme from '@/assets/themes/default.json'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        default: 'javascript',
    },
    minimap: {
        type: Boolean,
        default: true,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    padding: {
        type: Object,
        default: undefined,
    },
})
const emit = defineEmits(['update:modelValue'])

const root = ref<HTMLElement>()

let editor: monaco.editor.IStandaloneCodeEditor

const model = useVModel(props, 'modelValue', emit)

watch(
    () => props.modelValue,
    (value) => {
        if (!editor) return

        if (value !== editor.getValue()) {
            editor.setValue(value)
        }
    }
)

onMounted(() => {
    if (!root.value) return

    monaco.editor.defineTheme('app-theme', defaultTheme as any)

    editor = monaco.editor.create(root.value!, {
        value: model.value,
        language: props.language,
        readOnly: props.readonly,
        theme: 'app-theme',
        automaticLayout: true,
        minimap: { enabled: props.minimap },
        padding: props.padding,
        overviewRulerBorder: false,
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

self.MonacoEnvironment = {
    getWorker(_: any, label: string) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
</script>
<template>
    <div ref="root" class="w-full h-full"></div>
</template>
