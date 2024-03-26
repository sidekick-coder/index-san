<script lang="ts" setup>
import { MarkdownNode, MarkdownNodeComponent } from '@language-kit/markdown'
import { ref, watch } from 'vue';

import BlockParagraph from './BlockParagraph.vue'
import BlockHeading from './BlockHeading.vue'
import BlockComponent from './BlockComponent.vue'

const components = defineProp('components', {
    type: Array,
    default: () => ([])
})

const nodes = defineModel<MarkdownNode[]>({
    type: Array,
    default: () => []
})

const blockAttrs = defineProp<any>('blockAttrs', {
    type: Object,
    default: () => ({})
})

function isEmpty(node: MarkdownNode) {
    if (!node.is('Paragraph')) return false

    // if is an empty paragraph
    // and has less than 4 empty spaces
    return node.toText().replaceAll('\n', '').length <= 4
}

// setup

const context = ref<any>({})
const loading = ref(true)

function isSetup(node: MarkdownNode): node is MarkdownNodeComponent {
    return node.is('Component') && node.name === 'setup'
}

function setSetup(){
    loading.value = true

    const setupNode = nodes.value.find(isSetup)

    if (!setupNode) {
        loading.value = false
        return
    }

    // get all strings from setup node
    const variablesKeys = setupNode.toText().match(/(?<=const |let |var )\w+/g)

    const functionKeys = setupNode.toText().match(/(?<=function )\w+/g)

    const code = `        
        ${setupNode.body}

        return {
            ${variablesKeys?.join(', ')},
            ${functionKeys?.join(', ')}
        }        
    `

    const setup = new Function(code)

    context.value = setup() || {}
    
    setTimeout(() => {
        loading.value = false
    }, 100)
}

watch(nodes, setSetup, {
    immediate: true,
    deep: true
})

</script>

<template>
    <div class="h-full overflow-auto">
        <div v-if="!loading" class="flex flex-col">

            <template v-for="node in nodes">
    
                <div v-if="isEmpty(node) || isSetup(node) " class="hidden"></div>
    
                <BlockParagraph
                    v-else-if="node.is('Paragraph')"
                    :model-value="node"
                    :context="context"
                    v-bind="blockAttrs"
                />
    
                <BlockComponent
                    v-else-if="node.is('Component')"
                    :model-value="node"
                    :components="components"
                    v-bind="blockAttrs"
                />
    
                <BlockHeading
                    v-else-if="node.is('Heading')"
                    :model-value="node"
                    v-bind="blockAttrs"
                />
    
                <div v-else>
    
                    Invalid node type: {{ node.type }}
                </div>
                
            </template>
        </div>


    </div>
</template>
