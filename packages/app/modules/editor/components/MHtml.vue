<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useContext } from '../composable/context'
import { useNotify } from '@modules/notify/store'
import { useI18n } from 'vue-i18n'
import { useNodeEditor } from '../composable/node-editor'

// Props & Emit

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const context = useContext()

const el = ref<HTMLElement>()
const innerModel = ref('')

const textHaveVariable = computed(() => props.modelValue.includes('{{'))

function setInnerModel() {
    let text = props.modelValue

    if (text === innerModel.value) return

    if (text === el.value?.innerHTML) return

    innerModel.value = text
}

function update() {
    if (!el.value) return

    const html = (el.value as HTMLElement).innerHTML

    const text = html.replace('&nbsp;', ' ')

    emit('update:modelValue', text)
}

const onInput = debounce(() => {
    if (textHaveVariable.value) return

    update()
}, 100)

const editMode = ref(false)

function onBlur() {
    if (!textHaveVariable.value) return

    update()

    editMode.value = false
}

function onFocus() {
    if (!textHaveVariable.value) return

    editMode.value = true

    if (!el.value) return

    setTimeout(() => el.value!.focus(), 500)
}

watch(() => props.modelValue, setInnerModel, {
    immediate: true,
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
</script>

<template>
    <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>

    <div v-else-if="error" class="text-danger text-sm">
        {{ error.message }}
    </div>

    <component
        :is="componentData"
        v-else-if="textHaveVariable && !editMode"
        class="outline-none"
        contenteditable
        @focus="onFocus"
        @click="onFocus"
    />

    <div
        v-else
        ref="el"
        contenteditable
        class="outline-none"
        @input="onInput"
        @blur="onBlur"
        v-html="innerModel"
    ></div>
</template>
