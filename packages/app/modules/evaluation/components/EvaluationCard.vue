<script setup lang="ts">
import { useCss } from '@composables/css'
import MonacoEditor from '@modules/monaco/components/MEditor.vue'
import ANSIToHtml from 'ansi-to-html'
import { useEvaluation } from '../composables/use-evaluation'
import { defineResolver } from '../helpers/define-resolver'
import npmResolver from '../resolvers/npm'
import { useContext } from '@modules/editor/composable/context'
import { useNodeEditor } from '@modules/editor/composable/node-editor'

const props = defineProps({
    height: {
        type: String,
        default: '200',
    },
    showEditor: {
        type: Boolean,
        default: true,
    },
})

const css = useCss()

// config
const config = ref({
    dialog: false,
    showEditor: props.showEditor,
    height: Number(props.height) || 200,
})

const style = computed(() => ({
    height: css.toMeasurement(config.value.height),
}))

// evaluation

// model

const slots = useSlots()

const code = ref(`// write code`)

function setModel() {
    if (!slots?.default) return

    const children = slots.default()

    if (!children || !Array.isArray(children)) return

    const [content] = children

    if (!content) return

    if (typeof content.children === 'string') {
        code.value = content.children.trim()
        return
    }
}

onMounted(setModel)

// evaluate
const evaluation = useEvaluation()
const conversor = new ANSIToHtml()

const running = ref(false)
const output = ref<string[]>([])
const editor = useNodeEditor()

const pageResolver = defineResolver({
    test: (id) => id.startsWith('app:page'),
    resolve: async () => {
        return {
            useContext: () => editor.setupContext,
        }
    },
})

evaluation.addResolver(npmResolver)
evaluation.addResolver(pageResolver)

async function run() {
    running.value = true

    output.value = []

    output.value.push(conversor.toHtml('🔥 Running code...'))
    output.value.push(' ')

    const runtime = await evaluation.run(code.value, {
        waitEnd: false,
        timeout: 10000,
    })

    runtime.evaluation.on('stdout', (data) => {
        output.value.push(conversor.toHtml(data))
    })

    runtime
        .onDone()
        .then(() => {
            output.value.push(' ')

            output.value.push(conversor.toHtml('🎉 Code executed successfully!'))

            running.value = false
        })
        .catch((error) => {
            output.value.push(' ')

            output.value.push(conversor.toHtml(`❌ Code execution failed: ${error.message}`))

            running.value = false
        })
}
</script>
<template>
    <div class="my-2">
        <div
            v-if="config.showEditor"
            class="min-h-[100px] mb-2 rounded overflow-hidden"
            :style="style"
        >
            <MonacoEditor
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
            />
        </div>

        <div class="bg-b-03 flex py-2 px-4 rounded items-center flex-wrap">
            <div class="text-t-secondary">
                {{ $t('clickToEvaluate') }}
            </div>

            <div class="flex gap-x-4 ml-auto">
                <v-menu offset-y>
                    <template #activator="{ attrs }">
                        <v-btn :disabled="running" color="b-secondary" v-bind="attrs">
                            <v-icon name="cog" />
                        </v-btn>
                    </template>
                    <v-card color="b-secondary" width="150" class="mt-2">
                        <v-card-content class="flex flex-wrap space-y-4">
                            <v-checkbox v-model="config.showEditor" :label="$t('showEditor')" />
                            <v-input v-model="config.height" type="number" :label="$t('height')" />
                        </v-card-content>
                    </v-card>
                </v-menu>

                <v-btn :disabled="running" @click="run">
                    <v-icon
                        :name="running ? 'spinner' : 'play'"
                        :class="running ? 'animate-spin' : ''"
                        class="mr-2"
                    />

                    {{ $t('run') }}
                </v-btn>
            </div>

            <div v-if="output.length" class="w-full text-sm transition-all whitespace-pre-wrap">
                <div v-for="line in output" :key="line" v-html="line" />
            </div>
        </div>
    </div>
</template>
