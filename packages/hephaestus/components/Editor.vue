<script lang="ts" setup>
import { MarkdownNode, MarkdownNodeComponent } from '@language-kit/markdown'
import { ref, watch } from 'vue';
import { HecateCompiler, HecateCompilerResult } from 'hecate/composables/createCompiler'

import BlockParagraph from './BlockParagraph.vue'
import BlockHeading from './BlockHeading.vue'
import BlockComponent from './BlockComponent.vue'

import BlockError from './BlockError.vue'
import HVariable from '../../hecate/nodes/HVariable';
import HFunction from '../../hecate/nodes/HFunction';
import HImport from 'hecate/nodes/HImport';

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

const setupResult = defineModel<HecateCompilerResult>('setupResult', {
    type: Object,
    default: null
})

function isSetup(node: MarkdownNode): node is MarkdownNodeComponent {
    return node.is('Component') && node.name === 'setup'
}

async function setSetup(){
    const setupNode = nodes.value.find(isSetup)

    if (!setupNode) {
        loading.value = false
        return
    }

    if (!compiler.value) {
        setupResult.value = {
            exports: {},
            error: new Error('compiler not found'),
            logs: [],
        }
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

        if (n instanceof HImport) {
            n.properties.forEach(p => {
                properties.push(p.name)
            })
        }
    })

    const code = `
        export function setup(){
            ${setupNode.body}

            return { ${properties.join(', ')} }
        }
    `

    const result = await compiler.value.compile(code)

    
    if (!result.exports.setup || result.error) {
        console.error(result.error?.message || '[hephaestus] setup failed to compile')
        console.error(result)
        loading.value = false
        setupResult.value = {
            exports: {},
            error: result.error,
            logs: result.logs,
        }
        return
    }

    try {
        context.value = result.exports.setup()
    } catch (error) {
        console.error('[hephaestus] setup failed to run')
        console.error(error)
        loading.value = false
        setupResult.value = {
            exports: {},
            error: error,
            logs: [],
        }
        return
    }    
    
    setupResult.value = result
    
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
