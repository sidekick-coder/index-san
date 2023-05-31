<script setup lang="ts">
import NodeEditorBlock from './NodeEditorBlock.vue'
import { NodeWithId } from '../types/node'

const model = defineModel({
    type: NodeWithId,
    required: true,
})
</script>

<template>
    <NodeEditorBlock :node="model">
        <div class="text-danger">
            {{ $t('errors.errorRenderingBlock', [model.type]) }}
        </div>
    </NodeEditorBlock>
</template>
