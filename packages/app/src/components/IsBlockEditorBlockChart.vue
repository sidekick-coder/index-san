<script setup lang="ts">
import { MarkdownNodeComponent, MarkdownParser } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import { inspect } from '@composables/utils'
import { useCss } from '@composables/css'
import { resolvers } from '@modules/block-editor/composables/resolvers'

const model = defineModel({
    type: MarkdownNodeComponent,
    required: true,
    validator: (node: MarkdownNodeComponent) => node.name === 'chart',
})

// chart
const chartOptions = reactive({})
const chartLoading = ref(true)

const evaluation = useEvaluation()
const evaluationOutput = ref<string[]>([])

evaluation.addResolver(...resolvers)

evaluation.addResolver(
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
    chartLoading.value = true

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

    if (runtime.evaluation.stderr) {
        config.value.mode = 'debug'
    }

    setTimeout(() => (chartLoading.value = false), 300)
}

watch([() => model.value.body, () => model.value.attrs], setChart, { immediate: true, deep: true })

// edit

const edit = ref(false)
const code = ref(model.value.body)

const parser = new MarkdownParser()

async function update() {
    const node = new MarkdownNodeComponent()

    node.name = 'chart'
    node.body = code.value
    node.attrs = config.value
    node.meta = model.value.meta

    let attrsAsString = Object.entries(node.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    if (attrsAsString) {
        attrsAsString = ` { ${attrsAsString} }`
    }

    const markdown = `:: chart${attrsAsString}\n\n${node.body}\n::\n`

    node.tokens = parser.toTokens(markdown, {
        includeEndOfFileToken: false,
    })

    model.value = node
}

function onCancel() {
    edit.value = false
    code.value = model.value.body
}

function onSave() {
    edit.value = false
    update()
}

watch(
    () => model.value.body,
    (body) => {
        code.value = body
    }
)

// attrs

const css = useCss()
const loadingAttrs = ref(false)

const config = ref({
    height: '500',
    width: '100%',
    align: 'left',
    mode: 'chart' as 'chart' | 'debug' | 'dataset',
})

const style = computed(() => {
    return {
        height: css.toMeasurement(config.value.height),
        width: css.toMeasurement(config.value.width),
        marginLeft: ['right', 'center'].includes(config.value.align) ? 'auto' : undefined,
        marginRight: ['left', 'center'].includes(config.value.align) ? 'auto' : undefined,
    }
})

watch(
    () => model.value.attrs,
    () => {
        loadingAttrs.value = true

        const { attrs } = model.value

        config.value.height = attrs.height || config.value.height
        config.value.width = attrs.width || config.value.width
        config.value.align = attrs.align || config.value.align
        config.value.mode = (attrs.mode as any) || config.value.mode

        loadingAttrs.value = false
    },
    { immediate: true }
)

watch(
    config,
    () => {
        if (loadingAttrs.value) return

        update()
    },
    { deep: true }
)
</script>

<template>
    <Block v-model="model">
        <template #toolbar>
            <ToolbarAlignment v-model="config.align" />

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <ToolbarBtn v-bind="attrs" data-test-id="toolbar-reload-btn" @click="setChart">
                        <v-icon name="rotate" />
                    </ToolbarBtn>
                </template>
                {{ $t('reload') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <ToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'chart'"
                        data-test-id="toolbar-chart-btn"
                        @click="config.mode = 'chart'"
                    >
                        <v-icon name="chart-pie" />
                    </ToolbarBtn>
                </template>
                {{ $t('viewMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <ToolbarBtn v-bind="attrs" data-test-id="toolbar-edit-btn" @click="edit = true">
                        <v-icon name="pen" />
                    </ToolbarBtn>
                </template>
                {{ $t('editMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <ToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'debug'"
                        data-test-id="toolbar-debug-btn"
                        @click="config.mode = 'debug'"
                    >
                        <v-icon name="bug" />
                    </ToolbarBtn>
                </template>
                {{ $t('debugMode') }}
            </v-tooltip>

            <v-tooltip color="b-secondary">
                <template #activator="{ attrs }">
                    <ToolbarBtn
                        v-bind="attrs"
                        :active="config.mode === 'dataset'"
                        data-test-id="toolbar-dataset-btn"
                        @click="config.mode = 'dataset'"
                    >
                        <v-icon name="mdi:code-json" />
                    </ToolbarBtn>
                </template>
                {{ $t('dataset') }}
            </v-tooltip>

            <div class="w-28 flex items-center">
                <v-input
                    v-model.lazy="config.height"
                    flat
                    size="sm"
                    data-test-id="toolbar-input-height"
                >
                    <template #prepend>
                        <div class="text-t-secondary mr-2">H</div>
                    </template>
                </v-input>
            </div>
            <div class="w-28 flex items-center">
                <v-input
                    v-model.lazy="config.width"
                    flat
                    size="sm"
                    data-test-id="toolbar-input-width"
                >
                    <template #prepend>
                        <div class="text-t-secondary mr-2">W</div>
                    </template>
                </v-input>
            </div>
        </template>

        <div
            v-if="chartLoading"
            :style="{ height: style.height }"
            class="flex items-center justify-center animate-pulse w-full"
        >
            <v-icon name="chart-pie" class="text-[10rem] text-t-secondary" />
        </div>

        <v-chart v-else-if="config.mode === 'chart'" :style="style" :options="chartOptions" />

        <template v-else-if="config.mode === 'debug'">
            <div :style="{ height: style.height }" class="bg-b-03 p-4 w-full">
                <ANSICard :model-value="evaluationOutput" data-test-id="debug-view" />

                <div
                    v-if="!evaluationOutput.length"
                    class="h-full w-full flex items-center justify-center text-t-secondary"
                >
                    <div class="flex flex-col items-center space-y-2">
                        <v-icon name="bug" class="text-4xl" />

                        <div>
                            {{ $t('noEntity', [$t('log', 2)]) }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <MonacoEditor
            v-else-if="config.mode === 'dataset'"
            data-test-id="dataset-view"
            :model-value="inspect(chartOptions)"
            language="json"
            folding
            readonly
            :style="{ height: style.height }"
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

        <v-dialog v-model="edit">
            <v-card height="500" width="800" color="b-secondary">
                <v-card-head padding>
                    <v-card-title class="mr-auto">
                        {{ $t('editEntity', [$t('code')]) }}
                    </v-card-title>

                    <v-btn color="danger" class="mr-4" @click="onCancel">
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn @click="onSave">
                        {{ $t('save') }}
                    </v-btn>
                </v-card-head>

                <v-card-content>
                    <MonacoEditor
                        v-if="edit"
                        v-model="code"
                        data-test-id="editor"
                        @keydown.ctrl.s="update"
                    />
                </v-card-content>
            </v-card>
        </v-dialog>
    </Block>
</template>
