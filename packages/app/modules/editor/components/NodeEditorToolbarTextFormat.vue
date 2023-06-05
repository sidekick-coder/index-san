<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNodeEditor } from '../composable/node-editor'
import { NodeWithId } from '../types/node'

const tm = useI18n()
const editor = useNodeEditor()

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const actions = ref([
    {
        icon: 'bold',
        action: () => alert(`not implemented`),
    },
    {
        icon: 'italic',
        action: () => alert(`not implemented`),
    },
    {
        icon: 'strikethrough',
        action: () => alert(`not implemented`),
    },
    {
        icon: 'underline',
        action: () => alert(`not implemented`),
    },
])
</script>
<template>
    <v-btn
        v-for="(btn, index) in actions"
        :key="index"
        size="sm"
        color="text-t-secondary hover:text-t-primary"
        @click="btn.action"
    >
        <v-icon :name="btn.icon" />
    </v-btn>
</template>
