<script lang="ts" setup>
import { MarkdownNodeParagraph } from '@language-kit/markdown';
import { computed, ref, watch } from 'vue';

import BlockBase from './BlockBase.vue'
import BlockRenderer from './BlockRenderer.vue'

const node = defineModel<MarkdownNodeParagraph>({
    type: Object,
    required: true,
})

const context = defineProp<any>('context', {
    type: Object,
    default: () => ({})
})

// content
const content = ref('')

function setContent(){
    content.value = node.value.toHtml()
}

watch(node, setContent, { immediate: true })


</script>

<template>    
    <BlockBase icon="dashicons:editor-paragraph">
        <BlockRenderer :context="context" :model-value="content" />
    </BlockBase>
</template>
