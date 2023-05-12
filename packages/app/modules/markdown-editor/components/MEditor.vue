<script setup lang="ts">
import MonacoEditor from '../../monaco/components/MEditor.vue'
import { Parser, Node as MarkdownNode } from '@language-kit/markdown'

import MHeading from './MHeading.vue'

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
</script>
<template>
    <div class="flex h-full w-full">
        <div class="h-full w-6/12">
            <MonacoEditor
                :model-value="text"
                language="markdown"
                @update:model-value="updateText"
            />
        </div>
        <div class="h-full w-6/12 overflow-auto">
            <template v-for="(node, index) in nodes" :key="index">
                <MHeading
                    v-if="node.type === 'heading'"
                    :model-value="node"
                    @update:model-value="updateNode(index, $event)"
                />
            </template>
        </div>
    </div>
</template>
