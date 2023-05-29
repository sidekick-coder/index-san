<script setup lang="ts">
import * as Vue from 'vue'

import { waitFor } from '@composables/utils'
import { useContext } from '../composable/context'
import { Node as MarkdownNode } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import { createParser } from '@modules/evaluation/parser/parser'
import { useNodeHelper } from '@modules/evaluation/helpers/node-helper'
import npmResolver from '@modules/evaluation/resolvers/npm'

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const loading = ref(false)

const evaluation = useEvaluation()
const parser = createParser()
const nodeHelper = useNodeHelper()
const context = useContext()

evaluation.addResolver({
    test: (id) => id === 'vue',
    resolve: () => Promise.resolve(Vue),
})

evaluation.addResolver(npmResolver)

async function load() {
    if (loading.value) {
        await waitFor(() => !loading.value)
    }

    loading.value = true

    const startCodeIndex = props.modelValue.tokens.findIndex((t) => t.value === '\n')

    const code = props.modelValue.tokens
        .slice(startCodeIndex + 1, props.modelValue.tokens.length - 2)
        .map((t) => t.value)
        .join('')

    const nodes = parser.toNodes(code)

    const toExportNames = [] as string[]

    nodes.forEach((node) => {
        if (nodeHelper.isVariable(node) || nodeHelper.isFunction(node)) {
            toExportNames.push(node.name)
        }
    })

    let preparedCode = nodeHelper.toString(nodes)

    preparedCode += '\n\n'

    preparedCode += toExportNames.map((n) => `export const ${n} = ${n}`).join('\n')

    const result = await evaluation.run(preparedCode)

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
