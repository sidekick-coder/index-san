<script setup lang="ts">
import MBlock from './NodeEditorBlock.vue'
import { createComponentObject } from '@plugins/gc'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'

const model = defineModel({
    type: Object as PropType<NodeWithId>,
    required: true,
})

const editor = useNodeEditor()

const loading = ref(false)
const componentData = shallowRef<any>({
    name: 'NodeEditorBlockComponentRender',
    template: '<div></div>',
    components: createComponentObject(),
    setup: () => editor.setupContext,
})

function setComponentData() {
    loading.value = true

    const globalComponents = {
        button: 'VBtn',
    }

    let name = model.value.tokens[3].value

    if (!model.value.isComponent()) {
        return
    }

    const attrs = Object.entries(model.value.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

    const props = Object.entries(model.value.props)
        .map(([key, value]) => `:${key}="${value}"`)
        .join(' ')

    const events = Object.entries(model.value.events)
        .map(([key, value]) => `@${key}="${value}"`)
        .join(' ')

    if (globalComponents[name]) {
        name = globalComponents[name]
    }

    const template = `<${name} ${props} ${attrs} ${events} >${model.value.body}</${name}>`

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

async function load() {
    await editor.onLoadedContext()

    setComponentData()
}

watch(model, load)

onMounted(load)
</script>

<template>
    <m-block :node="model">
        <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>
        <component :is="componentData" v-else-if="componentData.template" />
    </m-block>
</template>
