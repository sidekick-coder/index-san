<script setup lang="ts">
import { useCss } from '@composables/css'
import { useEvaluation } from '../composables/use-evaluation'
import { useDefinedRef } from '@composables/utils'
import { Resolver } from '../types/resolver'

import MonacoEditor from '@modules/monaco/components/MEditor.vue'
import ANSICard from './ANSICard.vue'

const props = defineProps({
    height: {
        type: String,
        default: '200',
    },
    showEditor: {
        type: Boolean,
        default: true,
    },
    resolvers: {
        type: Array as PropType<Resolver[]>,
        default: () => [],
    },
})

const emit = defineEmits(['change'])

const css = useCss()

// config

const style = computed(() => ({
    height: css.toMeasurement(props.height),
}))

// evaluation

const slots = useSlots()
const model = defineModel({
    type: String,
    default: null,
})

const code = useDefinedRef(model, ref(`// write code`))

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

const running = ref(false)
const output = ref<string[]>([])

props.resolvers.forEach((r) => evaluation.addResolver(r))

async function run() {
    running.value = true

    output.value = []

    output.value.push('🔥 Running code...')
    output.value.push(' ')

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
            output.value.push(' ')

            output.value.push('🎉 Code executed successfully!')

            setTimeout(() => {
                running.value = false
            }, 800)
        })
        .catch((error) => {
            output.value.push(' ')

            output.value.push(`❌ Code execution failed: ${error.message}`)

            running.value = false
        })
}
</script>
<template>
    <div class="my-2">
        <div v-if="showEditor" class="min-h-[100px] mb-2 rounded overflow-hidden" :style="style">
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
                @keydown.ctrl.s="emit('change', code)"
            />
        </div>

        <ANSICard :model-value="output">
            <div class="flex w-full items-center">
                <div class="text-t-secondary">
                    {{ running ? 'Running...' : $t('clickToEvaluate') }}
                </div>

                <div class="flex gap-x-4 ml-auto">
                    <v-btn :disabled="running" @click="run">
                        <v-icon
                            :name="running ? 'spinner' : 'play'"
                            :class="running ? 'animate-spin' : ''"
                            class="mr-2"
                        />

                        {{ $t('run') }}
                    </v-btn>
                </div>
            </div>
        </ANSICard>
    </div>
</template>
