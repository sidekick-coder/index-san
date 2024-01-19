<script setup lang="ts">
import LDrawer from './components/LDrawer.vue'
import LToolbar from './components/LToolbar.vue'

defineProps({
    hideToolbar: {
        type: Boolean,
        default: false,
    },
})
</script>

<template>
    <div class="h-screen w-screen">
        <v-layout>
            <l-drawer />

            <v-layout-content class="bg-b-primary text-t-primary">
                <l-toolbar v-if="!hideToolbar" />

                <div class="h-[calc(100%-48px)]">
                    <slot>
                        <router-view v-slot="{ Component }">
                            <transition name="layout">
                                <component :is="Component" />
                            </transition>
                        </router-view>
                    </slot>
                </div>
            </v-layout-content>
        </v-layout>
    </div>
</template>

<style>
.layout-move,
.layout-enter-active,
.layout-leave-active {
    transition: all 0.3s ease;
}

.layout-enter-from,
.layout-leave-to {
    transform: translateX(10%);
    opacity: 0;
}

.layout-leave-active {
    position: absolute;
}
</style>
