<script setup lang="ts">
// main layout
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
                        <router-view />
                    </slot>
                </v-layout-content>
            </v-layout>
        </v-layout-content>
    </v-layout>
</template>
