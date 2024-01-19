<script setup lang="ts">
const theme = useTheme()

</script>
<template>
    <div :class="[theme.dark ? 'dark' : '']">
        <div class="dark:bg-zinc-900 h-screen w-screen flex">
            <is-app-drawer-mini />
            <slot />

        </div>
    </div>
</template>