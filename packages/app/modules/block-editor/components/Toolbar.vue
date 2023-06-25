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
        <transition-group
            enter-active-class="transition duration-300 absolute"
            leave-active-class="transition duration-300 absolute"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0 translate-y-[-50%]"
        >
            <div
                v-for="node in editor.nodes"
                v-show="editor.selected.some((n) => n.meta.id === node.meta.id)"
                :id="node.meta.toolbarId"
                :ref="(el: HTMLElement) => onLoadedToolbar(node, el)"
                :key="node.meta.id"
                data-test-id="node-toolbar"
                class="flex-1 overflow-hidden flex items-center h-full bg-b-primary"
            />
        </transition-group>

        <toolbar-btn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            class="ml-auto"
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
