<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useContext } from '../composable/context'
import { useNotify } from '@modules/notify/store'
import { useI18n } from 'vue-i18n'

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

watch(() => props.modelValue, setInnerModel, {
    immediate: true,
})

const onInput = debounce((event: InputEvent) => {
    const html = (event.target as HTMLElement).innerHTML

    const text = html.replace('&nbsp;', ' ')

    emit('update:modelValue', text)
}, 100)

// render vue component
const tm = useI18n()
const notify = useNotify()
const loading = ref(false)

const componentData = shallowRef<any>({
    template: '<div></div>',
    setup() {
        return context
    },
})

function setComponentData() {
    if (!textHaveVariable.value) return

    loading.value = true

    let text = props.modelValue

    componentData.value.template = `<div>${text}</div>`

    setTimeout(() => {
        loading.value = false
    }, 800)
}

function alertOfNotEditWhenUseVariable() {
    notify.warn(tm.t('markdownEditor.notEditWhenUseVariable'))
}

watch(() => props.modelValue, setComponentData, {
    immediate: true,
})
</script>

<template>
    <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>

    <component
        :is="componentData"
        v-else-if="textHaveVariable"
        :context="context"
        @click="alertOfNotEditWhenUseVariable"
    />

    <div
        v-else
        ref="el"
        contenteditable
        class="outline-none"
        @input="onInput"
        v-html="innerModel"
    ></div>
</template>
