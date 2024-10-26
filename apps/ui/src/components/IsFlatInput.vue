<script setup lang="ts">
const model = defineModel({
    type: [String, Number] as unknown as PropType<string | number>,
    default: false,
})
</script>
<template>
    <input
        v-model="model"
        class="bg-transparent size-full outline-none focus:ring-0"
    >
</template>
