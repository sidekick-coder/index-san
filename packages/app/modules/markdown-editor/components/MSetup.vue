<script setup lang="ts">
import { useContext } from '../composable/context'
import { Node as MarkdownNode } from '@language-kit/markdown'

import debounce from 'lodash/debounce'

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const loading = ref(false)
const context = useContext()
const instanceRef = ref<any>()

const load = debounce(() => {
    loading.value = true

    const startCodeIndex = props.modelValue.tokens.findIndex((t) => t.value === '\n')

    const code = props.modelValue.tokens
        .slice(startCodeIndex + 1)
        .map((t) => t.value)
        .join('')

    context.mount(code)

    loading.value = false
}, 1000)

watch(() => props.modelValue, load, {
    immediate: true,
})

watch(instanceRef, (value) => {
    if (!value) return

    context.setInstance(value)
})
</script>

<template>
    <component :is="context.sfc" v-if="context.sfc && !loading" ref="instanceRef" />
</template>
