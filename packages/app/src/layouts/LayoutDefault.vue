<script lang="ts" setup>
const drawer = ref(true)

</script>

<template>
    <is-app class="flex">
        <is-app-drawer-mini v-model:drawer="drawer" />

        <div 
            class="bg-body-700  border-body-500 transition-[width] duration-300"
            :class="drawer ? 'w-72 border-r' : 'w-0'"
        />

        <slot />
    </is-app>
</template>