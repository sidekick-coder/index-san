<script setup lang="ts">
// import NNotify from '@modules/notify/components/NNotify.vue'
// import DDialog from '@modules/dialog/components/DDialog.vue'
import LayoutDefault from './layouts/LayoutDefault.vue'
</script>
<template>
    <is-app>
        <layout-default>
            <router-view />
        </layout-default>
    </is-app>
</template>
