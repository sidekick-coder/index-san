<script lang="ts" setup>
const route = useRoute()

const path = computed(() => {
    return route.query.path as string
})
</script>

<template>
    <div>
        File {{ path }}
    </div>
</template>