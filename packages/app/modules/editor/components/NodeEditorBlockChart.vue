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
import NodeEditorToolbarBtn from './NodeEditorToolbarBtn.vue'
import NodeEditorToolbarAlignment from './NodeEditorToolbarAlignment.vue'
import VChart from '@components/VChart.vue'

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

const componentAttrs = computed(() => {
    if (!model.value.isComponent()) {
        return {}
    }

    return model.value.attrs
})

const config = reactive({
    height: '500',
    width: '500',
    align: 'left',
    mode: 'view' as 'view' | 'editor' | 'debug' | 'dataset',
})

const style = computed(() => {
    return {
        height: css.toMeasurement(config.height),
        width: css.toMeasurement(config.width),
        marginLeft: ['right', 'center'].includes(config.align) ? 'auto' : undefined,
        marginRight: ['left', 'center'].includes(config.align) ? 'auto' : undefined,
    }
})

watch(
    () => componentAttrs.value,
    (a) => Object.assign(config, a),
    { immediate: true }
)

// chart

const evaluation = useEvaluation()
const evaluationOutput = ref<string[]>([])
const editor = useNodeEditor()

const chartRef = ref<InstanceType<typeof VChart> | null>(null)
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

watch([() => config.align, () => config.height, () => config.width], () => {
    chartLoading.value = true

    setTimeout(() => {
        chartLoading.value = false
    }, 800)
})
</script>

<template>
    <NodeEditorBlock :node="model">
        <template #toolbar-tools>
            <NodeEditorToolbarAlignment v-model="config.align" />

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <NodeEditorToolbarBtn v-bind="attrs" @click="setChart">
                        <v-icon name="rotate" />
                    </NodeEditorToolbarBtn>
                </template>
                {{ $t('reload') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <NodeEditorToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'view'"
                        @click="config.mode = 'view'"
                    >
                        <v-icon name="chart-pie" />
                    </NodeEditorToolbarBtn>
                </template>
                {{ $t('viewMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <NodeEditorToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'editor'"
                        @click="config.mode = 'editor'"
                    >
                        <v-icon name="pen" />
                    </NodeEditorToolbarBtn>
                </template>
                {{ $t('editMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <NodeEditorToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'debug'"
                        @click="config.mode = 'debug'"
                    >
                        <v-icon name="bug" />
                    </NodeEditorToolbarBtn>
                </template>
                {{ $t('debugMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <NodeEditorToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'dataset'"
                        @click="config.mode = 'dataset'"
                    >
                        <v-icon name="mdi:code-json" />
                    </NodeEditorToolbarBtn>
                </template>
                {{ $t('dataset') }}
            </v-tooltip>

            <div class="w-28 flex items-center">
                <v-input v-model.lazy.number="config.height" flat size="sm">
                    <template #prepend>
                        <div class="text-t-secondary mr-2">H</div>
                    </template>
                </v-input>
            </div>
            <div class="w-28 flex items-center">
                <v-input v-model.lazy.number="config.width" flat size="sm">
                    <template #prepend>
                        <div class="text-t-secondary mr-2">W</div>
                    </template>
                </v-input>
            </div>
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

            <ANSICard
                v-else-if="config.mode === 'debug'"
                :model-value="evaluationOutput"
                :empty-message="$t('noEntity', [$t('log', 2)])"
            >
                <template #empty>
                    <div class="h-full w-full flex items-center justify-center text-t-secondary">
                        <div class="flex flex-col items-center space-y-2">
                            <v-icon name="bug" class="text-4xl" />

                            <div>
                                {{ $t('noEntity', [$t('log', 2)]) }}
                            </div>
                        </div>
                    </div>
                </template>
            </ANSICard>

            <div
                v-else-if="chartLoading"
                class="flex items-center justify-center animate-pulse h-full"
            >
                <v-icon name="chart-pie" class="text-[10rem] text-t-secondary" />
            </div>

            <v-chart
                v-else-if="config.mode === 'view'"
                ref="chartRef"
                :style="style"
                :options="chartOptions"
            />
        </v-card>
    </NodeEditorBlock>
</template>
