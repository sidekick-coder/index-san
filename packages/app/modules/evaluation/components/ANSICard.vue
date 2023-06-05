<script setup lang="ts">
import ANSIToHtml from 'ansi-to-html'

const model = defineModel({
    type: Array as PropType<string[]>,
    default: null,
})

const conversor = new ANSIToHtml()

const lines = computed(() => {
    if (!model.value) return []

    return model.value.map((line) => conversor.toHtml(line))
})
</script>
<template>
    <div class="bg-b-03 flex py-2 px-4 rounded flex-wrap transition-all overflow-auto h-full">
        <slot />

        <div v-if="lines.length" class="w-full text-sm whitespace-pre-wrap mt-4">
            <div v-for="line in lines" :key="line" v-html="line" />
        </div>

        <slot name="empty" />
    </div>
</template>
