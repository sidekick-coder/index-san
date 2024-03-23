<script setup lang="ts">
import { computed } from 'vue'

import MEditor from '@modules/monaco/components/MEditor.vue'
import EvaluationOutput from '@index-san/core/entities/evaluation-output'

const props = defineProps({
    output: {
        type: Object as () => EvaluationOutput | null,
        default: null,
    },
    noErrorStack: {
        type: Boolean,
        default: false,
    },
})

const content = computed(() => {
    const result: string[] = []

    if (!props.output) return

    if (props.output.error) {
        result.push('[error]')
        result.push(props.output.error.message)
    }

    if (props.output.error && !props.noErrorStack) {
        result.push(props.output.error.stack)
    }

    if (props.output.logs.length) {
        result.push('[logs]')
        result.push(...props.output.logs)
    }

    if (props.output.result) {
        result.push('[result]')

        result.push(JSON.stringify(props.output.result, null, 4))
    }

    return result.join('\n')
})
</script>

<template>
    <m-editor
        readonly
        :model-value="content"
        language="shell"
    />
</template>
