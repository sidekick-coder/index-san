<script lang="ts" setup>

import AppPageRender from './AppPageRender.vue';

const route = useRoute();

</script>

<template>
    <AppPageRender :name="route.params.name" :page-props="route.query" />
</template>
