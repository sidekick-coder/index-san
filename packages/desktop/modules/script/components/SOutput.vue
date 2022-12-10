<script setup lang="ts">
import ExecuteScriptDTO from '@core/use-cases/execute-script/execute-script.dto'
import { computed } from 'vue'

import MEditor from '@/modules/monaco/components/MEditor.vue'

const props = defineProps({
    output: {
        type: Object as () => ExecuteScriptDTO.Output,
        default: null,
    },
})

const content = computed(() => {
    const result: string[] = []

    if (!props.output) return

    if (props.output.logs.length) {
        result.push('[logs]')
        result.push(...props.output.logs)
    }

    if (props.output.error) {
        result.push('[error]')
        result.push(props.output.error.message)
        result.push(props.output.error.stack)
    }

    if (props.output.result) {
        result.push('[result]')

        result.push(JSON.stringify(props.output.result, null, 4))
    }

    return result.join('\n')
})
</script>

<template>
    <m-editor readonly :model-value="content" language="shell" />
</template>
