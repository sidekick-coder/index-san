<script setup lang="ts">
import { useEditor } from '../composables/editor'
import { MarkdownNode } from '@language-kit/markdown'

import ToolbarBtn from './ToolbarBtn.vue'

const editor = useEditor()

function onLoadedToolbar(node: MarkdownNode, el: HTMLElement | null) {
    if (!el) {
        editor.toolbars.delete(node.meta.id)
        return
    }

    editor.toolbars.set(node.meta.id, el)
}

// move nodes

function moveUp() {
    editor.moveSelectedToUp()
}

function moveDown() {
    editor.moveSelectedToDown()
}

// crud

function deleteNodes() {
    // editor.deleteNodes()
}
</script>
<template>
    <div class="h-12 border-b border-lines px-7 flex items-center relative">
        <div
            v-for="n in editor.nodes"
            :id="n.meta.toolbarId"
            :ref="(el: HTMLElement) => onLoadedToolbar(n, el)"
            :key="n.meta.id"
            data-test-id="node-toolbar"
            :class="editor.selected.includes(n) ? 'opacity-100' : 'opacity-0'"
        />

        <div class="flex-1"></div>

        <toolbar-btn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            @mousedown.prevent="moveUp"
        >
            <v-icon name="chevron-up" />
        </toolbar-btn>

        <toolbar-btn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            @mousedown.prevent="moveDown"
        >
            <v-icon name="chevron-down" />
        </toolbar-btn>

        <toolbar-btn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            @mousedown.prevent="deleteNodes"
        >
            <v-icon name="trash" />
        </toolbar-btn>

        <toolbar-btn size="sm" color="text-t-secondary hover:text-t-primary">
            <v-icon name="plus" />
        </toolbar-btn>
    </div>
</template>
