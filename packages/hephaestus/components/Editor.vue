<script lang="ts" setup>
import { MarkdownNode } from '@language-kit/markdown'
import { TokenType } from '@language-kit/lexer'

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

</script>

<template>
    <div class="h-full overflow-auto">

        <template v-for="node in nodes">

            <div v-if="isEmpty(node)" class="hidden"></div>

            <BlockParagraph
                v-else-if="node.is('Paragraph')"
                :model-value="node"
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
</template>
