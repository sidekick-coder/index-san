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
    <v-layout>
        <l-drawer />

        <v-layout-content class="bg-b-primary text-t-primary">
            <v-layout use-percentage>
                <l-toolbar v-if="!hideToolbar" />

                <v-layout-content>
                    <slot>
                        <router-view v-slot="{ Component }">
                            <transition name="layout">
                                <component :is="Component" />
                            </transition>
                        </router-view>
                    </slot>
                </v-layout-content>
            </v-layout>
        </v-layout-content>
    </v-layout>
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
