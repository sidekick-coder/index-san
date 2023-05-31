<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import EvaluationCard from '@modules/evaluation/components/EvaluationCard.vue'
import VBtn from '@components/VBtn.vue'

const model = defineModel({
    type: Object as PropType<NodeWithId>,
    required: true,
})

const editor = useNodeEditor()

const loading = ref(false)
const componentAvailable = {
    VBtn,
    EvaluationCard,
}

const componentData = shallowRef<any>({
    name: 'NodeEditorBlockComponentRender',
    template: '<div></div>',
    components: componentAvailable,
    setup: () => editor.setupContext,
})

const name = computed(() => {
    if (!model.value.isComponent()) return 'div'

    let name = model.value.name

    const replaceKeys = {
        button: 'VBtn',
        script: 'EvaluationCard',
    }

    if (replaceKeys[name]) {
        name = replaceKeys[name]
    }

    return name
})

const isValid = computed(() => {
    return Object.keys(componentAvailable).includes(name.value)
})

function setComponentData() {
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
        <${name.value} ${props} ${attrs} ${events} >
            ${model.value.body}
        </${name.value}>
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

async function load() {
    await editor.onLoadedContext()

    setComponentData()
}

watch(model, load)

onMounted(load)
</script>

<template>
    <NodeEditorBlock :node="model">
        <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>
        <div v-else-if="!isValid" class="text-danger text-sm">
            {{ $t('invalidComponent') }}: {{ name }}
        </div>
        <component :is="componentData" v-else-if="componentData.template" />
    </NodeEditorBlock>
</template>
