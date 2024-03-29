<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'

const root = ref<HTMLTextAreaElement>()

const model = defineModel<string>({
    type: String,
    default: '',
})

const height = ref(56)

function setSize(){
    const lines = model.value.split('\n').length

    height.value = Math.max(56, lines * 20)
}

watch(model, setSize, { immediate: true })
</script>

<template>
    <div
        :style="{ height: height + 'px' }"
        class="flex"
    >
        <div class="w-10" />

        <monaco-editor
            v-model="model"
            language="hephaestus"
            line-numbers="off"
            :folding="false"
            :line-decorations-width="0"
        />
    </div>
</template>
