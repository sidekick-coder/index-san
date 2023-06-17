<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'
import VBtn from '@components/VBtn.vue'
import { useNodeEditor } from '../composable/node-editor'
import { MarkdownNodeNodeType } from '@language-kit/markdown'

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const loading = ref(false)
const editor = useNodeEditor()

const componentData = shallowRef<any>({
    name: 'NodeEditorBlockButton',
    template: '<div></div>',
    setup: () => editor.setupContext,
    components: {
        VBtn,
    },
})

function load() {
    const { node } = model.value

    if (!node.is(MarkdownNodeNodeType.Component)) {
        return
    }

    loading.value = true

    const attrs = Object.entries(node.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    const template = `
        <v-btn ${attrs}>
            ${node.body}
        </v-btn>
    `

    componentData.value = {
        name: componentData.value.name,
        components: componentData.value.components,
        setup: componentData.value.setup,
        template,
    }

    setTimeout(() => {
        loading.value = false
    }, 800)
}

onMounted(load)
</script>

<template>
    <NodeEditorBlock :node="model">
        <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>
        <component :is="componentData" v-else-if="componentData.template" />
    </NodeEditorBlock>
</template>
