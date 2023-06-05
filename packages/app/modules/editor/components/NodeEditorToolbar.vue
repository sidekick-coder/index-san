<script setup lang="ts">
import { useNodeEditor } from '../composable/node-editor'

const editor = useNodeEditor()

// tools

const tools = ref({
    loading: false,
})

function setTools() {
    // tools.value.loading = true
    // setTimeout(() => {
    //     tools.value.loading = false
    // }, 800)
}

watch(() => editor.toolbar.tools, setTools, {
    immediate: true,
})

onMounted(() => {
    editor.toolbar.loaded = true
})

// block actions
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
        <div
            v-for="n in editor.nodesRef"
            :id="`toolbar-tools-${n.id}`"
            :key="n.id"
            class="flex overflow-hidden h-full transition-all duration-300 opacity-0"
            :class="editor.isSelected(n) ? 'opacity-100 ' : 'translate-y-2'"
        />

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
