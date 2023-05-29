<script setup lang="ts">
import MBlock from './NodeEditorBlock.vue'
import { Node as MarkdownNode } from '@language-kit/markdown'
import { TokenType } from '@language-kit/lexer'
import { useContext } from '../composable/context'
import { createComponentObject } from '@plugins/gc'

// Props & Emit

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => {
        return props.modelValue
    },
    set(value: MarkdownNode) {
        emit('update:modelValue', value)
    },
})

const context = useContext()
const loading = ref(false)
const componentData = shallowRef({
    template: null as null | string,
    components: createComponentObject(),
    setup() {
        return context
    },
})

function load() {
    loading.value = true

    const globalComponents = {
        button: 'VBtn',
    }

    let name = model.value.tokens[3].value

    if (!model.value.isComponent()) {
        return
    }

    const attrs = Object.entries(model.value.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    const props = Object.entries(model.value.props)
        .map(([key, value]) => `:${key}="${value}"`)
        .join(' ')

    const events = Object.entries(model.value.events)
        .map(([key, value]) => `@${key}="${value}"`)
        .join(' ')

    if (globalComponents[name]) {
        name = globalComponents[name]
    }

    const template = `<${name} ${props} ${attrs} ${events} >${model.value.body}</${name}>`

    componentData.value.template = template

    setTimeout(() => {
        loading.value = false
    }, 800)
}

watch(model, load)

onMounted(load)

// destroy

const destroy = ref(false)

watch(loading, (value) => {
    if (value) {
        destroy.value = true
        return
    }

    destroy.value = false
})

onUnmounted(() => {
    destroy.value = true
})
</script>

<template>
    <m-block v-if="!destroy" :node="model">
        <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>
        <component
            :is="componentData as any"
            v-else-if="componentData.template"
            :context="context"
        />
    </m-block>
</template>
