<script setup lang="ts">
import MonacoEditor from '../../monaco/components/MEditor.vue'
import { Parser, Node as MarkdownNode, NodeType } from '@language-kit/markdown'
import NodeEditor from './NodeEditor.vue'

import uniqueId from 'lodash/uniqueId'

import MHeading from './MHeading.vue'
import MParagraph from './MParagraph.vue'
import MSetup from './MSetup.vue'
import MComponent from './MComponent.vue'
import { provideContext } from '../composable/context'
import { provideManager } from '../composable/nodes-manager'
import { NodeWithId } from '../types/node'

const model = defineModel({
    type: String,
    default: '',
})

const parser = new Parser()

const manager = provideManager()

const text = ref('')
const nodes = ref<NodeWithId[]>([])

function mountNodes(value: string) {
    return parser.toNodes(value).map((n) => new NodeWithId(n))
}

function load() {
    nodes.value = mountNodes(model.value)

    text.value = model.value
}

function updateText(value: string) {
    text.value = value

    nodes.value = mountNodes(value)

    model.value = value
}

function updateNodes(newNodes: NodeWithId[]) {
    nodes.value = newNodes

    text.value = nodes.value.map((n) => n.toText()).join('')
}

function onChangeNodes() {
    text.value = nodes.value.map((n) => n.toText()).join('')

    model.value = text.value
}

onMounted(load)

// context

provideContext()

function isSetup(node: MarkdownNode) {
    if (node.type !== NodeType.Component) return

    const name = node.tokens[3].value

    return name === 'setup'
}
</script>
<template>
    <div class="flex h-full w-full">
        <div class="h-full w-6/12">
            <MonacoEditor v-model="text" language="markdown" @keydown.ctrl.s="updateText(text)" />
        </div>

        <div class="h-full w-6/12">
            <NodeEditor v-model="nodes" @change="onChangeNodes" />
        </div>
        <!-- <div class="h-full w-6/12 overflow-auto pb-80 border-l border-b-secondary/25">
            <template v-for="(node, index) in manager.nodes" :key="index">
                <MSetup
                    v-if="isSetup(node)"
                    :model-value="node"
                    @update:model-value="updateNode(index, $event)"
                />

                <MComponent
                    v-else-if="node.type === 'component'"
                    :model-value="node"
                    @update:model-value="updateNode(index, $event)"
                />

                <MHeading
                    v-else-if="node.type === 'heading'"
                    :model-value="node"
                    @update:model-value="updateNode(index, $event)"
                />

                <MParagraph
                    v-else-if="node.type === 'paragraph'"
                    :model-value="node"
                    @update:model-value="updateNode(index, $event)"
                />

                <div v-else class="p-5 text-danger bg-danger/25 border-b">
                    {{ $t('errors.errorRenderingBlock', [node.type]) }}
                </div>
            </template>
        </div> -->
    </div>
</template>
