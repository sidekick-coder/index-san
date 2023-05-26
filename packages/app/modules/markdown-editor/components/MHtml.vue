<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useContext } from '../composable/context'

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

    emit('update:modelValue', html)
}, 100)

// render vue component

const loading = ref(false)

const componentData = shallowRef({
    template: '<div></div>',
    props: {
        context: {
            type: Object,
            required: true,
        },
    },
})

function setComponentData() {
    if (!textHaveVariable.value) return

    loading.value = true

    let text = props.modelValue

    // replace any {{ variable }} with {{ context[variable] }}
    text = text.replaceAll(/{{ ([a-zA-Z0-9]+) }}/g, (match, p1) => {
        return `{{ context.${p1} }}`
    })

    // replace any {{ method(arg1, arg2) }} with {{ context.method(arg1, arg2) }}
    text = text.replaceAll(/{{ ([a-zA-Z0-9]+)\((.*)\) }}/g, (match, p1, p2) => {
        return `{{ context.${p1}(${p2}) }}`
    })

    componentData.value.template = `<div>${text}</div>`

    setTimeout(() => {
        loading.value = false
    }, 800)
}

watch(() => props.modelValue, setComponentData, {
    immediate: true,
})
</script>

<template>
    <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>

    <component :is="componentData as any" v-else-if="textHaveVariable" :context="context" />

    <div
        v-else
        ref="el"
        contenteditable
        class="outline-none"
        @input="onInput"
        @keydown.enter.prevent
        v-html="innerModel"
    ></div>
</template>
