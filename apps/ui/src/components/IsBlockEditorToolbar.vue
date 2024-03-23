<script setup lang="ts">
import { MarkdownNode } from '@language-kit/markdown'
import delay from 'lodash/delay'

const editor = useBlockEditor()

function onLoadedToolbar(node: MarkdownNode, el: HTMLElement | null) {
    if (!el) {
        editor.toolbars.delete(node.meta.id)
        return
    }

    editor.toolbars.set(node.meta.id, el)
}

function canShowToolbar(node: MarkdownNode) {
    if (!editor.selected.length) return false

    if (editor.selected.length > 1) return false

    return editor.selected.some((n) => n.meta.id === node.meta.id)
}

// move nodes

function moveUp() {
    editor.moveSelectedToUp()
}

function moveDown() {
    editor.moveSelectedToDown()
}

// crud

function onNewNode(node: MarkdownNode) {
    editor.add(node)

    delay(() => editor.select(node, true), 100)
}

function deleteNodes() {
    editor.destroySelected()
}
</script>
<template>
    <div class="h-12 border-b border-zinc-700 px-7 flex items-center relative">
        <transition-group
            enter-active-class="transition duration-300 absolute"
            leave-active-class="transition duration-300 absolute"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0 translate-y-[-50%]"
        >
            <div
                v-for="node in editor.nodes"
                v-show="canShowToolbar(node)"
                :id="node.meta.toolbarId"
                :ref="(el: any) => onLoadedToolbar(node, el)"
                :key="node.meta.id"
                data-test-id="node-toolbar"
                class="flex-1 overflow-hidden flex items-center h-full bg-b-primary"
            />
        </transition-group>

        <IsBlockEditorToolbarBtn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            class="ml-auto"
            @mousedown.prevent="moveUp"
        >
            <IsIcon name="mdi:chevron-up" />
        </IsBlockEditorToolbarBtn>

        <IsBlockEditorToolbarBtn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            @mousedown.prevent="moveDown"
        >
            <IsIcon name="mdi:chevron-down" />
        </IsBlockEditorToolbarBtn>

        <IsBlockEditorToolbarBtn
            size="sm"
            color="text-t-secondary hover:text-t-primary"
            @mousedown.prevent="deleteNodes"
        >
            <IsIcon name="mdi:trash" />
        </IsBlockEditorToolbarBtn>

        <IsBlockEditorNewBlockMenu @select="onNewNode">
            <template #activator="{ attrs }">
                <IsBlockEditorToolbarBtn
                    v-bind="attrs"
                    size="sm"
                    color="text-t-secondary hover:text-t-primary"
                >
                    <IsIcon name="mdi:plus" />
                </IsBlockEditorToolbarBtn>
            </template>
        </IsBlockEditorNewBlockMenu>
    </div>
</template>
