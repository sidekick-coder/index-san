<script lang="ts" setup>
import { MarkdownNodeParagraph } from '@language-kit/markdown';
import { computed, ref, watch } from 'vue';

import BlockBase from './BlockBase.vue'

const node = defineModel<MarkdownNodeParagraph>({
    type: Object,
    required: true,
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
        <div v-html="content"></div>
    </BlockBase>
</template>
