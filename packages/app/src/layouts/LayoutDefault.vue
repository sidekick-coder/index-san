<script setup lang="ts">
const theme = useTheme()

</script>
<template>
    <div class="h-screen w-screen flex">
        <is-app-drawer-mini />

        <slot />
    </div>
</template>