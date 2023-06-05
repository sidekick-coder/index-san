<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNodeEditor } from '../composable/node-editor'

const tm = useI18n()
const editor = useNodeEditor()

const actions = ref([
    {
        icon: 'bold',
        action: () => {},
    },
    {
        icon: 'italic',
        action: () => {},
    },
    {
        icon: 'strikethrough',
        action: () => {},
    },
    {
        icon: 'underline',
        action: () => {},
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
