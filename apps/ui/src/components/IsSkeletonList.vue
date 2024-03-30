<script lang="ts" setup>

</script>

<template>
    <div
        v-for="i in 10"
        :key="i"
        class="px-4 py-2"
    >
        <is-list-item
            class="animate-pulse bg-body-700 "
            size="xs"
        />
    </div>
</template>
