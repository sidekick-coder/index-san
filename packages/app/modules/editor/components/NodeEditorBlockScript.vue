<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import EvaluationCard from '@modules/evaluation/components/EvaluationCard.vue'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import npmResolver from '@modules/evaluation/resolvers/npm'
import { MarkdownNodeNodeType, MarkdownParser } from '@language-kit/markdown'
import { Token } from '@language-kit/lexer'

// mount component
const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new MarkdownParser()
const loading = ref(false)
const code = ref(`// write code`)
const editor = useNodeEditor()

const attrs = computed(() => {
    if (!model.value.node.is(MarkdownNodeNodeType.Component)) {
        return {}
    }

    return model.value.node.attrs
})

const resolvers = [
    npmResolver,
    defineResolver({
        test: (id) => id.startsWith('app:page'),
        resolve: async () => {
            return {
                useContext: () => editor.setupContext,
            }
        },
    }),
]

function load() {
    if (!model.value.node.is(MarkdownNodeNodeType.Component)) {
        return
    }

    code.value = model.value.node.body

    loading.value = true

    setTimeout(() => {
        loading.value = false
    }, 800)
}

function update() {
    const payload = [':: script', code.value, '::'].join('\n')

    const tokens = parser.toTokens(payload)

    const lastIndex = tokens.length - 1
    const breakLine = Token.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    model.value.node.tokens = tokens

    if (model.value.node.is(MarkdownNodeNodeType.Component)) {
        model.value.node.body = code.value
        model.value.node.name = model.value.node.name
        model.value.node.attrs = model.value.node.attrs
    }

    model.value = model.value
}

watch(model, load, { immediate: true })

// attrs
const config = reactive({
    height: '200',
    showEditor: false,
})

watch(
    () => attrs.value,
    (a) => {
        config.height = a.height ?? '200'
        config.showEditor = [a.showEditor, a['show-editor']].includes('true')
    },
    { immediate: true }
)
</script>

<template>
    <NodeEditorBlock :node="model">
        <EvaluationCard
            v-model="code"
            :height="config.height"
            :resolvers="resolvers"
            :show-editor="config.showEditor"
            @change="update"
        />

        <template #menu-before>
            <v-list-item size="xs">
                <v-checkbox v-model="config.showEditor" type="number" :label="$t('showEditor')" />
            </v-list-item>
            <v-list-item size="xs">
                <v-icon name="fluent:auto-fit-height-20-filled" class="-ml-1 mr-2 text-lg" />
                <v-input v-model="config.height" placeholder="200" width="100" @click.stop />
            </v-list-item>
        </template>
    </NodeEditorBlock>
</template>
