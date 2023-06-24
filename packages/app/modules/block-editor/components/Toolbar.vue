<script setup lang="ts">
import { useEditor } from '../composables/editor'

const editor = useEditor()
</script>
<template>
    <div>
        <div
            v-for="n in editor.nodes"
            :id="n.meta.toolbarId"
            :key="n.meta.id"
            data-test-id="node-toolbar"
            :class="editor.selected.includes(n) ? 'opacity-100' : 'opacity-0'"
        />
    </div>
</template>
