<script setup lang="ts">
import { MarkdownNodeComponent } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'

import Block from './Block.vue'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
// import MonacoEditor from '@modules/monaco/components/MEditor.vue'

const MonacoEditor = defineAsyncComponent(() => import('@modules/monaco/components/MEditor.vue'))

const node = defineModel({
    type: MarkdownNodeComponent,
    required: true,
    validator: (n: MarkdownNodeComponent) => n.name === 'script',
})

const running = defineModel('running', {
    type: Boolean,
    default: false,
    local: true,
})

const code = ref(node.value.body)
const evaluation = useEvaluation()
const output = ref<string[]>([])

async function run() {
    output.value = []

    output.value.push('🔥 Running code...')
    output.value.push('')

    const runtime = await evaluation.run(code.value, {
        immediate: false,
        timeout: 10000,
    })

    runtime.on('stdout', (data) => output.value.push(data))

    runtime.on('stderr', (data) => output.value.push(data))

    runtime.run()

    runtime
        .onDone()
        .then(() => {
            output.value.push('')

            output.value.push('🎉 Code executed successfully!')

            running.value = false
        })
        .catch(() => {
            output.value.push('')

            output.value.push('🚨 Code execution failed!')

            running.value = false
        })
}

async function update() {
    node.value.body = code.value

    node.value = node.value
}
</script>
<template>
    <block v-model="node">
        <v-btn data-test-id="run-button" @click="run">
            {{ $t('run') }}
        </v-btn>

        <v-btn data-test-id="clear-button" @click="output = []">
            {{ $t('clear') }}
        </v-btn>

        <MonacoEditor
            v-model="code"
            data-test-id="editor"
            :line-options="{
                show: 'off',
                decorationsWidth: 16,
                numbersMinChars: 0,
            }"
            :padding="{
                top: 8,
                bottom: 8,
            }"
            :scrollbar="{
                verticalScrollbarSize: 0,
                horizontalScrollbarSize: 0,
                useShadows: false,
                horizontal: 'hidden',
                vertical: 'hidden',
            }"
            render-line-highlight="none"
            @keydown.ctrl.s="update"
        />

        <ANSICard v-model="output" />
    </block>
</template>
