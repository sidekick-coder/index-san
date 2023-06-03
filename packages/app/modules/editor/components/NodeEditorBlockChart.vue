<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import MonacoEditor from '@modules/monaco/components/MEditor.vue'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import npmResolver from '@modules/evaluation/resolvers/npm'
import { MarkdownParser } from '@language-kit/markdown'
import { inspect } from '@composables/utils'
import { useCss } from '@composables/css'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
import { Token } from '@language-kit/lexer'

// mount component
const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new MarkdownParser()
const loading = ref(false)
const code = ref(`// write code`)

function load() {
    if (!model.value.isComponent()) {
        return
    }

    code.value = model.value.body

    loading.value = true

    setTimeout(() => {
        loading.value = false
    }, 800)
}

function update() {
    const payload = [':: chart', code.value, '::'].join('\n')

    const tokens = parser.toTokens(payload)

    const lastIndex = tokens.length - 1
    const breakLine = Token.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new NodeWithId(
        {
            type: NodeWithId.types.Component,
            tokens,
        },
        model.value.id
    )

    if (node.isComponent() && model.value.isComponent()) {
        node.body = code.value
        node.name = model.value.name
        node.attrs = model.value.attrs
    }

    model.value = node
}

watch(model, load, { immediate: true })

// attrs

const css = useCss()

const config = reactive({
    height: '440',
    mode: 'view' as 'view' | 'editor' | 'debug' | 'dataset',
})

// watch(
//     () => attrs.value,
//     (a) => {
//         config.height = a.height ?? '440'
//         config.showEditor = [a.showEditor, a['show-editor']].includes('true')
//     },
//     { immediate: true }
// )

// chart

const evaluation = useEvaluation()
const evaluationOutput = ref<string[]>([])
const editor = useNodeEditor()

const chartLoading = ref(false)
const chartOptions = reactive<any>({})

evaluation.addResolver(
    npmResolver,
    defineResolver({
        test: (id) => id.startsWith('app:page'),
        resolve: async () => {
            return {
                useContext: () => editor.setupContext,
            }
        },
    }),
    defineResolver({
        test: (id) => id === 'app:chart',
        resolve: async () => {
            return {
                useChart: () => chartOptions,
            }
        },
    })
)

async function setChart() {
    if (!model.value.isComponent()) {
        return
    }

    evaluationOutput.value = []

    const runtime = await evaluation.run(model.value.body, {
        immediate: false,
        timeout: 10000,
    })

    runtime.on('stdout', (data) => {
        evaluationOutput.value.push(data)
    })

    runtime.on('stderr', (data) => {
        evaluationOutput.value.push(data)
    })

    runtime.run()

    await runtime.onDone()

    chartLoading.value = true

    setTimeout(() => {
        chartLoading.value = false
    }, 800)
}

watch(model, setChart, { immediate: true })
</script>

<template>
    <NodeEditorBlock :node="model">
        <template #menu-before>
            <v-list-item size="xs">
                <v-icon name="fluent:auto-fit-height-20-filled" class="-ml-1 mr-2 text-lg" />
                <v-input v-model="config.height" placeholder="200" width="100" @click.stop />
            </v-list-item>
            <v-list-item size="xs" @click="setChart">
                <v-icon name="rotate" class="mr-2" />
                {{ $t('reload') }}
            </v-list-item>
            <v-list-item size="xs" @click="config.mode = 'view'">
                <v-icon name="eye" class="mr-2" />
                {{ $t('viewMode') }}
            </v-list-item>
            <v-list-item size="xs" @click="config.mode = 'editor'">
                <v-icon name="pen" class="mr-2" />
                {{ $t('editMode') }}
            </v-list-item>
            <v-list-item size="xs" @click="config.mode = 'debug'">
                <v-icon name="bug" class="mr-2" />
                {{ $t('debugMode') }}
            </v-list-item>
            <v-list-item size="xs" @click="config.mode = 'dataset'">
                <v-icon name="bug" class="mr-2" />
                {{ $t('dataset') }}
            </v-list-item>
        </template>

        <v-card :height="config.height" class="py-4">
            <MonacoEditor
                v-if="config.mode === 'editor'"
                v-model="code"
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

            <MonacoEditor
                v-else-if="config.mode === 'dataset'"
                :model-value="inspect(chartOptions)"
                language="json"
                folding
                readonly
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
            />

            <ANSICard v-else-if="config.mode === 'debug'" :model-value="evaluationOutput" />

            <div
                v-else-if="chartLoading"
                class="flex items-center justify-center animate-pulse h-full"
            >
                <v-icon name="chart-pie" class="text-[10rem] text-t-secondary" />
            </div>

            <v-chart v-else-if="config.mode === 'view'" ref="chartRef" :options="chartOptions" />
        </v-card>
    </NodeEditorBlock>
</template>
