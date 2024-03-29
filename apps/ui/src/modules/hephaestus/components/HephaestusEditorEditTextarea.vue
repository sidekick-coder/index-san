<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'

const emit = defineEmits(['save'])

const model = defineModel<string>({
    type: String,
    default: '',
})

const height = ref(56)

function setSize(){
    const lines = model.value.split('\n').length + 4

    height.value = Math.max(60, lines * 20)
}

watch(model, setSize, { immediate: true })
</script>

<template>
    <div
        :style="{ height: height + 'px' }"
        class="flex w-full overflow-auto"
    >
        <div class="w-10" />

        <monaco-editor
            v-model="model"
            language="hephaestus"
            line-numbers="off"
            autofocus
            :folding="false"
            :line-decorations-width="0"
            @keydown.ctrl.s.prevent="$emit('save')"
            @blur="$emit('save')"
        />
    </div>
</template>
