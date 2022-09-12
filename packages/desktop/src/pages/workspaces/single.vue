<script setup lang='ts'>

defineProps({
    id: {
        type: String,
        required: true
    }
})

</script>
<template>
    <div>Workspace: {{ id }}</div>
</template>