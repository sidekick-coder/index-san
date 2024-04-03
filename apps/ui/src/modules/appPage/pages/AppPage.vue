<script lang="ts" setup>

import AppPageRender from '@/modules/appPage/components/AppPageRender.vue';

const route = useRoute();

const name = computed(() => {
    const args = Array.isArray(route.params.name) ? route.params.name : [route.params.name];

    return args.join('/');
});

const pageProps = computed(() => {
    return route.query;
});


</script>

<template>
    <AppPageRender
        :name="name"
        :page-props="pageProps"
    />
</template>
