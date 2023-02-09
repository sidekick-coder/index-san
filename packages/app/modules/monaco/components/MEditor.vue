<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { createMonaco, loadLibs, MonacoLibs } from '../services/monaco'

// Props & Emits

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
    padding: {
        type: Object,
        default: undefined,
    },
    lineNumbers: {
        type: String,
        default: 'on',
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

let editor: ReturnType<typeof createMonaco>

const model = useVModel(props, 'modelValue', emit)

onMounted(() => {
    if (!root.value) return

    editor = createMonaco(root.value!, {
        value: model.value,
        language: props.language,
        readOnly: props.readonly,
        minimap: { enabled: props.minimap },
        padding: props.padding,
        overviewRulerBorder: false,
        lineNumbers: props.lineNumbers as any,
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
