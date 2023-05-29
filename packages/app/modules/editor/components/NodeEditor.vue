<script setup lang="ts">
import { NodeWithId } from '@modules/editor/types/node'

import MHeading from './MHeading.vue'
import NodeEditorBlockParagraph from './NodeEditorBlockParagraph.vue'
import NodeEditorBlockSetup from './NodeEditorBlockSetup.vue'
import NodeEditorBlockComponent from './NodeEditorBlockComponent.vue'
import { provideNodeEditor } from '../composable/node-editor'
import { NodeType } from '@language-kit/markdown'
import { Token, TokenType } from '@language-kit/lexer'
import { Icon } from '@iconify/vue'

const nodes = defineModel({
    type: Array as PropType<NodeWithId[]>,
    default: () => [],
})

const emit = defineEmits(['change'])

const editor = provideNodeEditor()

function isSetupNode(node: NodeWithId) {
    if (!node.isComponent()) return

    return node.name === 'setup'
}

function findNodeSetup() {
    return nodes.value.find(isSetupNode)
}

function findStartNode() {
    const setupNode = findNodeSetup()

    if (!setupNode) return nodes.value[0]

    const setupIndex = nodes.value.indexOf(setupNode)

    return nodes.value.find((n, i) => {
        if (i <= setupIndex) return false

        return n.tokens.find((t) => t.type !== TokenType.BreakLine)
    })
}

function updateNode(index: number, node: NodeWithId) {
    nodes.value.splice(index, 1, node)

    emit('change', nodes.value)
}

// Hidden blocks

const hiddenIds = ref<string[]>([])

function setHideIds() {
    hiddenIds.value = []

    const startNode = findStartNode()

    if (!startNode) return

    const startNodeIndex = nodes.value.indexOf(startNode)

    if (startNodeIndex === -1) return

    nodes.value.forEach((n, index) => {
        if (index < startNodeIndex) {
            hiddenIds.value.push(n.id)
        }
    })
}

watch(nodes, setHideIds, {
    immediate: true,
})

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
    <div
        v-if="error"
        class="h-full w-full flex items-center justify-center border-l border-b-secondary/25"
    >
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

    <div v-else class="h-full overflow-auto pb-80 border-l border-b-secondary/25">
        <div
            v-for="(node, index) in nodes"
            :key="node.id"
            :class="hiddenIds.includes(node.id) ? 'hidden' : ''"
            class="w-full"
        >
            <NodeEditorBlockSetup
                v-if="isSetupNode(node)"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockComponent
                v-else-if="node.type === 'component'"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <MHeading
                v-else-if="node.type === 'heading'"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <NodeEditorBlockParagraph
                v-else-if="node.type === 'paragraph'"
                :model-value="node"
                @update:model-value="updateNode(index, $event)"
            />

            <div v-else class="p-5 text-danger bg-danger/25 border-b">
                {{ $t('errors.errorRenderingBlock', [node.type]) }}
            </div>
        </div>
    </div>
</template>
