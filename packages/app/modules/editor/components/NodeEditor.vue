<script setup lang="ts">
import { NodeWithId } from '@modules/editor/types/node'

import MHeading from './MHeading.vue'
import MParagraph from './MParagraph.vue'
import MSetup from './MSetup.vue'
import MComponent from './MComponent.vue'
import { provideNodeEditor } from '../composable/node-editor'

const nodes = defineModel({
    type: Array as PropType<NodeWithId[]>,
    default: () => [],
})

const emit = defineEmits(['change'])

const editor = provideNodeEditor()

function shouldHide(node: NodeWithId) {
    if (!node.isComponent()) return

    return node.name === 'setup'
}

function isSetup(node: NodeWithId) {
    if (!node.isComponent()) return

    return node.name === 'setup'
}

function updateNode(index: number, node: NodeWithId) {
    nodes.value.splice(index, 1, node)

    emit('change', nodes.value)
}
</script>
<template>
    <div class="h-full overflow-auto pb-80 border-l border-b-secondary/25">
        <div
            v-for="(node, index) in nodes"
            :key="node.id"
            :class="shouldHide(node) ? 'hidden' : ''"
            class="w-full"
        >
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
        </div>
    </div>
</template>
