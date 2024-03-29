<script lang="ts" setup>
import { MarkdownNode, MarkdownNodeComponent, MarkdownParser } from '@language-kit/markdown'
import { ref, watch } from 'vue';
import { HecateCompiler } from 'hecate/composables/createCompiler'
import { onClickOutside } from '@vueuse/core'

import BlockParagraph from './BlockParagraph.vue'
import BlockHeading from './BlockHeading.vue'
import BlockComponent from './BlockComponent.vue'

import BlockError from './BlockError.vue'
import EditorEditTextarea from './EditorEditTextarea.vue'

import HVariable from 'hecate/nodes/HVariable';
import HFunction from 'hecate/nodes/HFunction';
import HImport from 'hecate/nodes/HImport';


// extensions
const components = defineProp('components', {
    type: Array,
    default: () => ([])
})

const blocks = defineProp<any[]>('blocks', {
    type: Array,
    default: () => ([])
})

const editTextareaComponent = defineProp<any>('editTextareaComponent', {
    type: Object,
    default: () => EditorEditTextarea
})

// nodes
const nodes = defineModel<MarkdownNode[]>({
    type: Array,
    default: () => [],
})

function isEmpty(node: MarkdownNode) {
    if (!node.is('Paragraph')) return false

    // if is an empty paragraph
    // and has less than 4 empty spaces
    return node.toText().replaceAll('\n', '').length <= 4
}

// setup
const compiler = defineProp<HecateCompiler>('compiler', {
    type: Object,
    default: null,
})

const context = ref<any>({})
const loading = ref(true)

const errors = defineModel<Error[]>('errors', {
    type: Array,
    default: () => ([])
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
        errors.value.push(new Error('[hephaestus] Compiler not found'))
        return
    }

    loading.value = true

    const hNodes = compiler.value.toNodes(compiler.value.minify(setupNode.body))

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
        loading.value = false        
        errors.value.push(result.error)
        return
    }

    try {
        context.value = result.exports.setup()
    } catch (err) {
        errors.value.push(err as Error)
        loading.value = false
        return
    }
    
    setTimeout(() => {
        loading.value = false
    }, 100)
}

watch(nodes, setSetup, {
    immediate: true,
    deep: true
})

// edit
const parser = defineProp<MarkdownParser>('parser', {
    type: Object,
    default: () => new MarkdownParser()
})

const editedIndex = ref(-1)
const editedText = ref('')
const editedNode = ref<MarkdownNode>()
const editedContainerRef = ref<any>()

function editNode(node: MarkdownNode, index: number) {
    editedIndex.value = index
    editedText.value = node.toText()
    editedNode.value = node
}

function discardEditedNode(){
    editedIndex.value = -1
    editedText.value = ''
    editedNode.value = undefined
}

function saveEditedNode(){
    if (editedIndex.value === -1) return

    let text = nodes.value.map(n => n.toText()).join('')

    const start = editedNode.value?.start
    const end = editedNode.value?.end === -1 ? text.length : editedNode.value?.end

    if (start === undefined || end === undefined) {
        editedIndex.value = -1
        editedText.value = ''
        editedNode.value = undefined

        console.error('[hephaestus] error updating nodes')
        return
    }

    text = text.slice(0, start) + editedText.value + text.slice(end + 1)
    
    nodes.value = parser.value.toNodes(text)

    editedIndex.value = -1
    editedText.value = ''
}

onClickOutside(editedContainerRef, saveEditedNode)
</script>

<template>
    <div class="h-full w-full overflow-auto pb-[60%]">
        <div v-if="!loading" class="flex flex-col">

            <BlockError
                v-for="(node, index) in nodes"
                :key="index"
                @click="editNode(node, index)"
                class="relative"
            >

                <div
                    v-if="editedIndex === index"
                    :ref="e => editedContainerRef = e"
                    class="relative"
                >
                    <component
                        :is="editTextareaComponent"
                        v-if="editedIndex === index"
                        v-model="editedText"
                        @blur="saveEditedNode"
                        @save="saveEditedNode"
                    />
                </div>
                
                <component
                    v-else-if="blocks.some(b => b.test(node))"
                    :is="blocks.find(b => b.test(node)).component"
                    :model-value="node"
                    :context="context"
                />
    
                <div v-else-if="isEmpty(node) || isSetup(node) " class="hidden"></div>
    
                <BlockParagraph
                    v-else-if="node.is('Paragraph')"
                    :model-value="node"
                    :context="context"
                />
    
                <BlockComponent
                    v-else-if="node.is('Component')"
                    :model-value="node"
                    :components="components"
                    :context="context"
                />
    
                <BlockHeading
                    v-else-if="node.is('Heading')"
                    :model-value="node"
                />
    
                <div v-else>
    
                    Invalid node type: {{ node.type }}
                </div>
            </BlockError>
        </div>


    </div>
</template>
