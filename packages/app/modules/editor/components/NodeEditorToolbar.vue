<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNodeEditor } from '../composable/node-editor'
import NodeEditorToolbarParagraph from './NodeEditorToolbarParagraph.vue'
const tm = useI18n()
const editor = useNodeEditor()

const tooltip = {
    delay: 500,
}

function addNewBlock() {
    alert('addNewBlock')
}

function moveUp() {
    editor.moveSelectedNodesToUp()
}

function moveDown() {
    editor.moveSelectedNodesToDown()
}

function deleteBlock() {
    editor.deleteSelectedNodes()
}
</script>
<template>
    <div class="h-12 border-b border-lines px-7 flex items-center relative">
        <NodeEditorToolbarParagraph />

        <div class="flex-1"></div>

        <v-btn size="sm" color="text-t-secondary hover:text-t-primary" @click="moveUp">
            <v-icon name="chevron-up" />
        </v-btn>

        <v-btn size="sm" color="text-t-secondary hover:text-t-primary" @click="moveDown">
            <v-icon name="chevron-down" />
        </v-btn>

        <v-btn size="sm" color="text-t-secondary hover:text-t-primary" @click="deleteBlock">
            <v-icon name="trash" />
        </v-btn>

        <v-btn size="sm" color="text-t-secondary hover:text-t-primary">
            <v-icon name="plus" />
        </v-btn>
    </div>
</template>
