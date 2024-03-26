<script lang="ts" setup>
import { MarkdownNode, MarkdownNodeComponent } from '@language-kit/markdown'
import { ref, watch } from 'vue';
import { HecateCompiler } from 'hecate/composables/createCompiler'

import BlockParagraph from './BlockParagraph.vue'
import BlockHeading from './BlockHeading.vue'
import BlockComponent from './BlockComponent.vue'

import BlockError from './BlockError.vue'
import HVariable from '../../hecate/nodes/HVariable';
import HFunction from '../../hecate/nodes/HFunction';

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

const compiler = defineProp<HecateCompiler>('compiler', {
    type: Object,
    default: null,
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

async function setSetup(){
    const setupNode = nodes.value.find(isSetup)


    if (!setupNode) {
        return
    }

    if (!compiler.value) {
        console.error('[hephaestus] setup used without a compiler')
        return
    }

    loading.value = true

    const hNodes = compiler.value.toNodes(setupNode.body)

    const properties = [] as string[]
    
    hNodes.forEach(n => {
        if (n instanceof HVariable) {
            properties.push(n.name)
        }

        if (n instanceof HFunction) {
            properties.push(n.name)
        }
    })

    const code = `
        export function setup(){
            ${setupNode.body}

            return { ${properties.join(', ')} }
        }
    `

    const result = await compiler.value.compile(code)

    if (!result?.exports.setup) {
        console.error('[hephaestus] error on evaluation')
        loading.value = false
        return
    }

    
    context.value = result.exports.setup()
    
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

            <BlockError v-for="node in nodes">
    
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
                
            </BlockError>
        </div>


    </div>
</template>
