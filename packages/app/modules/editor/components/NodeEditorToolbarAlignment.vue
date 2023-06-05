<script setup lang="ts">
import NodeEditorToolbarBtn from './NodeEditorToolbarBtn.vue'

const model = defineModel({
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
})
</script>
<template>
    <div class="flex items-center">
        <NodeEditorToolbarBtn :active="model === 'left'" @click="model = 'left'">
            <v-icon class="text-base" name="ph:align-left-fill" />
        </NodeEditorToolbarBtn>

        <NodeEditorToolbarBtn :active="model === 'center'" @click="model = 'center'">
            <v-icon class="text-base" name="ph:align-center-horizontal-fill" />
        </NodeEditorToolbarBtn>

        <NodeEditorToolbarBtn :active="model === 'right'" @click="model = 'right'">
            <v-icon class="text-base" name="ph:align-right-fill" />
        </NodeEditorToolbarBtn>
    </div>
</template>
