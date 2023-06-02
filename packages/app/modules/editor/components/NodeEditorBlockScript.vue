<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import EvaluationCard from '@modules/evaluation/components/EvaluationCard.vue'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import npmResolver from '@modules/evaluation/resolvers/npm'
import { MarkdownToken, NodeType, Parser } from '@language-kit/markdown'
import merge from 'lodash/merge'
import { useDefinedRef } from '@composables/utils'

// mount component
const model = defineModel({
    type: NodeWithId,
    required: true,
})

const parser = new Parser()
const loading = ref(false)
const code = ref(`// write code`)
const editor = useNodeEditor()

const attrs = computed(() => {
    if (!model.value.isComponent()) {
        return {}
    }

    return merge(model.value.attrs, model.value.props)
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
    const payload = [':: script', code.value, '::'].join('\n')

    const tokens = parser.toTokens(payload)

    const lastIndex = tokens.length - 1
    const breakLine = MarkdownToken.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new NodeWithId(
        {
            type: NodeType.Component,
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
