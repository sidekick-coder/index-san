<script setup lang="ts">
import { useNodeEditor } from '../composable/node-editor'
import { onClickOutside } from '@vueuse/core'

// Props & Emit

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const el = ref<HTMLElement>()
const innerModel = ref('')
const editMode = ref(false)

const textHaveVariable = computed(() => {
    // have {{ }} in text
    return /\{\{.*\}\}/.test(props.modelValue)
})

function setInnerModel() {
    let text = props.modelValue

    // replace whitespace with &nbsp;
    text = text.replace(/ /g, '&nbsp;')

    innerModel.value = text
}

function update() {
    if (!el.value) return

    const html = (el.value as HTMLElement).innerHTML

    // replace &nbsp; with whitespace
    const text = html.replace(/&nbsp;/g, ' ')

    if (text === props.modelValue) return

    emit('update:modelValue', text)
}

function onFocus() {
    if (props.readonly) return

    editMode.value = true
}

function onClick() {
    if (props.readonly) return

    editMode.value = true
}

function onBlur() {
    update()

    editMode.value = false

    setTimeout(setInnerModel, 500)
}

watch(() => props.modelValue, setInnerModel, {
    immediate: true,
})

onClickOutside(el, () => {
    if (editMode.value) {
        onBlur()
    }
})

// render vue component
const loading = ref(false)
const editor = useNodeEditor()

const error = ref<Error | null>(null)
const componentData = shallowRef<any>({
    name: 'NodeEditorRender',
    template: '<div></div>',
    setup: () => editor.setupContext,
})

function setComponentData() {
    if (!textHaveVariable.value) return

    loading.value = true

    let text = props.modelValue

    // replace whitespace with &nbsp;
    text = text.replace(/ /g, '&nbsp;')

    componentData.value = {
        name: componentData.value.name,
        template: `<div>${text}</div>`,
        setup: componentData.value.setup,
    }

    setTimeout(() => {
        loading.value = false
    }, 100)
}

async function loadComponent() {
    if (textHaveVariable.value) {
        await editor.onLoadedContext()
    }

    error.value = editor.validate(props.modelValue)

    if (error.value) return

    setComponentData()
}

watch(() => props.modelValue, loadComponent, {
    immediate: true,
})

// expose methods

function focus() {
    if (props.readonly) return

    el.value?.focus()

    editMode.value = true
}

function blur() {
    if (props.readonly) return

    el.value?.blur()

    editMode.value = false
}

defineExpose({
    inputRef: el,
    focus,
    blur,
})
</script>

<template>
    <div class="relative">
        <div v-if="error" class="text-danger text-sm">
            {{ error.message }}
        </div>

        <template v-else>
            <component
                :is="componentData"
                v-if="textHaveVariable"
                class="absolute left-0 top-0 transition-opacity w-full h-full"
                :class="[editMode ? 'opacity-0' : '']"
            />

            <div
                ref="el"
                :contenteditable="!props.readonly"
                class="outline-none transition-opacity"
                :class="[textHaveVariable && !editMode ? 'opacity-0' : '']"
                @blur="onBlur"
                @focus="onFocus"
                @click="onClick"
                @keydown.ctrl.s="update"
                @keydown.enter="update"
                v-html="innerModel"
            />
        </template>
    </div>
</template>
