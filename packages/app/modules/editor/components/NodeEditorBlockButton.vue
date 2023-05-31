<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { Parser } from '@language-kit/markdown'
import { NodeWithId } from '../types/node'
import VBtn from '@components/VBtn.vue'
import { useNodeEditor } from '../composable/node-editor'

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
    if (!model.value.isComponent()) {
        return
    }

    loading.value = true

    const attrs = Object.entries(model.value.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    const props = Object.entries(model.value.props)
        .map(([key, value]) => `:${key}="${value}"`)
        .join(' ')

    const events = Object.entries(model.value.events)
        .map(([key, value]) => `@${key}="${value}"`)
        .join(' ')

    const template = `
        <v-btn ${props} ${attrs} ${events} >
            ${model.value.body}
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
