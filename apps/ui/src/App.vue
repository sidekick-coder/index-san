<script setup lang="ts">
// import NNotify from '@modules/notify/components/NNotify.vue'
// import DDialog from '@modules/dialog/components/DDialog.vue'
import LayoutDefault from './layouts/LayoutDefault.vue'
</script>
<template>
    <div>
        <is-app v-if="$route.meta.layout === 'empty'">
            <router-view />
        </is-app>

        <layout-default v-else>
            <router-view />
        </layout-default>
    </div>
</template>
