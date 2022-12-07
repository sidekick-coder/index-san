<script setup lang="ts">
// main layout
import LDrawer from './components/LDrawer.vue'
import LToolbar from './components/LToolbar.vue'
</script>

<template>
    <w-layout>
        <slot name="drawer">
            <l-drawer />
        </slot>

        <w-content class="bg-b-primary text-t-primary">
            <w-layout use-percentage>
                <slot name="toolbar">
                    <l-toolbar />
                </slot>

                <w-content>
                    <slot>
                        <router-view />
                    </slot>
                </w-content>
            </w-layout>
        </w-content>
    </w-layout>
</template>
