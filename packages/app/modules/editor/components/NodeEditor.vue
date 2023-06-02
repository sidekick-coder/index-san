<script setup lang="ts">
import { NodeWithId } from '@modules/editor/types/node'

import NodeEditorBlockHeading from './NodeEditorBlockHeading.vue'
import NodeEditorBlockParagraph from './NodeEditorBlockParagraph.vue'
import NodeEditorBlockSetup from './NodeEditorBlockSetup.vue'
import NodeEditorBlockScript from './NodeEditorBlockScript.vue'

import { provideNodeEditor } from '../composable/node-editor'
import { Icon } from '@iconify/vue'
import NodeEditorBlockButton from './NodeEditorBlockButton.vue'
import NodeEditorBlockError from './NodeEditorBlockError.vue'
import { TokenType } from '@language-kit/lexer'
import { NodeType } from '@language-kit/markdown'
import NodeEditorBlockChart from './NodeEditorBlockChart.vue'

const nodes = defineModel({
    type: Array as PropType<NodeWithId[]>,
    default: () => [],
})

const emit = defineEmits(['change'])

const editor = provideNodeEditor()

editor.setNodesRef(nodes)

function updateNode(index: number, node: NodeWithId) {
    nodes.value.splice(index, 1, node)

    emit('change', nodes.value)
}

function isComponent(name: string, node: NodeWithId) {
    if (!node.isComponent()) return

    return node.name === name
}

function isBreakLine(node: NodeWithId) {
    if (node.type !== NodeType.Paragraph) return

    if (node.tokens.length > 3) return

    return node.tokens.every((token) =>
        [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type)
    )
}

editor.on('add', () => emit('change'))
editor.on('remove', () => emit('change'))

// handle errors

const error = ref<Error | null>(null)

watch(nodes, () => {
    error.value = null
})

onErrorCaptured((err) => {
    error.value = err
})
</script>
<template>
    <div v-if="error" class="h-full w-full flex items-center justify-center">
        <div class="text-center">
            <div class="text-6xl text-danger mb-4">
                <Icon icon="mdi:alert-circle-outline" class="mx-auto" />
            </div>
            <div class="text-2xl font-bold">
                {{ $t('errors.errorRenderingBlocks') }}
            </div>
            <div class="text-1xl text-danger">
                {{ error.message }}
            </div>
        </div>
    </div>

    <div v-else class="h-full w-full overflow-auto pb-80">
        <div
            v-for="(node, index) in nodes"
            :key="node.id"
            class="w-full"
            :class="[isBreakLine(node) ? 'hidden' : '']"
        >
            <NodeEditorBlockSetup
                v-if="isComponent('setup', node)"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockHeading
                v-else-if="node.type === 'heading'"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockParagraph
                v-else-if="node.type === 'paragraph'"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockButton
                v-else-if="isComponent('button', node)"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockScript
                v-else-if="isComponent('script', node)"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockChart
                v-else-if="isComponent('chart', node)"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockError
                v-else
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />
        </div>
    </div>
</template>
