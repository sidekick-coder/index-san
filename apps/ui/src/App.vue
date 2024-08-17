<script setup lang="ts">
import LayoutDefault from './layouts/LayoutDefault.vue'
</script>
<template>
    <div>
        <is-snackbar-container />

        <is-app v-if="$route.meta.layout === 'empty'">
            <router-view />
        </is-app>

        <layout-default v-else>
            <router-view />
        </layout-default>
    </div>
</template>
