<script setup lang="ts">
import * as Vue from 'vue'

import { waitFor } from '@composables/utils'
import { useContext } from '../composable/context'
import { Node as MarkdownNode } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import { defineFunctionProcessor } from '@modules/evaluation/processors/functions'
import { defineVariableProcessor } from '@modules/evaluation/processors/variables'

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const loading = ref(false)

const evaluation = useEvaluation()

evaluation.addResolver({
    test: (id) => id === 'vue',
    resolve: () => Promise.resolve(Vue),
})

evaluation.addProcessor({
    order: 1,
    process: defineFunctionProcessor((name, params, body) => {
        return `export function ${name}(${params}) {${body}}`
    }),
})

evaluation.addProcessor({
    order: 1,
    process: defineVariableProcessor((name, value) => {
        return `
            const ${name} = ${value}

            __INDEX_SAN_EXPORT({ ${name} })
        `
    }),
})

const context = useContext()

async function load() {
    if (loading.value) {
        await waitFor(() => !loading.value)
    }

    loading.value = true

    const startCodeIndex = props.modelValue.tokens.findIndex((t) => t.value === '\n')

    const code = props.modelValue.tokens
        .slice(startCodeIndex + 1)
        .map((t) => t.value)
        .join('')

    const result = await evaluation.run(code)

    Object.assign(context, result)

    loading.value = false
}

watch(() => props.modelValue, load, {
    immediate: true,
})
</script>

<template>
    <div class="hidden"></div>
</template>
