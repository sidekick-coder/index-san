<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const root = ref<HTMLTextAreaElement>()

const model = defineModel<string>({
    type: String,
    default: '',
})

function setTextareaSize(){
    if (!root.value) return

    console.log('update')

    root.value.style.height = 'auto'
    root.value.style.height = root.value.scrollHeight + 'px'
}

onMounted(() => {
    setTextareaSize()

    if (!root.value) return

    root.value.addEventListener('change', setTextareaSize)
})

onUnmounted(() => {
    if (!root.value) return

    root.value.removeEventListener('change', setTextareaSize)
})

</script>

<template>
    <textarea v-model="model" ref="root" class="w-full bg-body-800 px-10 py-4 outline-none" />
</template>
