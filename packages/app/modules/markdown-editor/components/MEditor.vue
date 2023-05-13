<script setup lang="ts">
import MonacoEditor from '../../monaco/components/MEditor.vue'
import { Parser, Node as MarkdownNode, NodeType } from '@language-kit/markdown'

import MHeading from './MHeading.vue'
import MParagraph from './MParagraph.vue'
import MSetup from './MSetup.vue'
import MComponent from './MComponent.vue'
import { provideContext } from '../composable/context'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

const parser = new Parser()

const nodes = ref<MarkdownNode[]>([])

const text = ref('')

function load() {
    nodes.value = parser.toNodes(props.modelValue)

    text.value = props.modelValue
}

function updateNode(index: number, node: MarkdownNode) {
    nodes.value.splice(index, 1, node)

    text.value = nodes.value.map((n) => n.toText()).join('')

    emit('update:modelValue', text.value)
}

function updateText(value: string) {
    text.value = value

    nodes.value = parser.toNodes(value)

    emit('update:modelValue', value)
}

watch(() => props.modelValue, load, {
    immediate: true,
})

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

        <div class="h-full w-6/12 overflow-auto">
            <template v-for="(node, index) in nodes" :key="index">
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
        </div>
    </div>
</template>
