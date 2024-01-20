<script setup lang="ts">
// import NNotify from '@modules/notify/components/NNotify.vue'
// import DDialog from '@modules/dialog/components/DDialog.vue'
import { useRoute } from 'vue-router';
import LayoutDefault from './layouts/LayoutDefault.vue'
import LayoutEmpty from './layouts/LayoutEmpty.vue'

const route = useRoute()

const options: any = {
    default: LayoutDefault,
    empty: LayoutEmpty,
}

function findLayout(key: string){
    const option = options[key as keyof typeof options]

    if (!option) {
        return options.default
    }

    return option

}


</script>
<template>
    <is-app>
        <component :is="findLayout($route.meta.layout as string)">
            <router-view />
        </component>
    </is-app>
</template>
