<script setup lang="ts">
const theme = useTheme()

</script>
<template>
    <div :class="[theme.dark ? 'dark' : '']">
        <div class="dark:bg-zinc-800 dark:text-zinc-100 font-roboto h-screen w-screen flex">
            <slot />

        </div>
    </div>
</template>