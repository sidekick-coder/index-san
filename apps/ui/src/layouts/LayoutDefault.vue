<script lang="ts" setup>

const drawer = useLocalStorage('drawer', true)

</script>

<template>
    <is-app class="flex bg-body-700">
        <is-app-drawer-mini v-model:drawer="drawer" />

        <div 
            class="bg-body-800  border-body-500 transition-[width] duration-300"
            :class="drawer ? 'w-72 border-r' : 'w-0'"
        />

        <div class="flex-1 h-dvh bg-body-700 overflow-hidden">
            <slot />
        </div>
    </is-app>
</template>