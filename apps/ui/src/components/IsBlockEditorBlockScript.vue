<script setup lang="ts">
import { MarkdownNodeComponent, MarkdownParser } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'

import Block from './Block.vue'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
import ToolbarBtn from './ToolbarBtn.vue'
import { resolvers } from '@modules/block-editor/composables/resolvers'

const MonacoEditor = defineAsyncComponent(
    () => import('@modules/monaco/components/MEditor.vue') as any
)

const model = defineModel({
    type: MarkdownNodeComponent,
    required: true,
    validator: (n: MarkdownNodeComponent) => n.name === 'script',
})

const running = ref(false)
const code = ref(model.value.body)
const evaluation = useEvaluation()
const output = ref<string[]>([])

evaluation.setResolvers(resolvers)

async function run() {
    running.value = true

    output.value = []

    const runtime = await evaluation.run(code.value, {
        immediate: false,
        timeout: 10000,
    })

    runtime.on('stdout', (data) => output.value.push(data))

    runtime.on('stderr', (data) => output.value.push(data))

    runtime.run()

    await runtime.onDone()

    running.value = false
}

// edit

const edit = ref(false)
const parser = new MarkdownParser()

async function update() {
    const node = new MarkdownNodeComponent()

    node.name = 'script'
    node.body = code.value

    const markdown = `:: script\n ${node.body}\n::\n`

    node.tokens = parser.toTokens(markdown, {
        includeEndOfFileToken: false,
    })

    node.meta = model.value.meta

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
</script>
<template>
    <block
        v-model="model"
        class="pr-10"
    >
        <template #toolbar>
            <ToolbarBtn
                data-test-id="edit-btn"
                @click="edit = true"
            >
                <v-icon name="pen" />
            </ToolbarBtn>
        </template>

        <div class="flex flex-wrap bg-b-03 px-4 py-2 rounded my-2">
            <div class="flex w-full gap-x-4 items-center">
                <div class="text-t-secondary mr-auto">
                    {{ running ? 'Running...' : $t('clickToEvaluate') }}
                </div>

                <v-btn
                    data-test-id="run-btn"
                    :disabled="running"
                    @click="run"
                >
                    <v-icon
                        :name="running ? 'spinner' : 'play'"
                        :class="running ? 'animate-spin' : ''"
                        class="mr-2"
                    />
                    {{ $t('run') }}
                </v-btn>

                <v-btn
                    data-test-id="clear-btn"
                    :disabled="running"
                    @click="output = []"
                >
                    {{ $t('clear') }}
                </v-btn>
            </div>

            <div
                v-show="output.length"
                class="w-full"
            >
                <ANSICard v-model="output" />
            </div>
        </div>

        <v-dialog v-model="edit">
            <v-card
                height="500"
                width="800"
                color="b-secondary"
            >
                <v-card-head padding>
                    <v-card-title class="mr-auto">
                        {{ $t('editEntity', [$t('code')]) }}
                    </v-card-title>

                    <v-btn
                        color="danger"
                        class="mr-4"
                        @click="onCancel"
                    >
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn
                        data-test-id="save-btn"
                        @click="onSave"
                    >
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
    </block>
</template>
