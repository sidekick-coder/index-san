<script setup lang="ts">
import { ref } from 'vue'

import { useWindowApi  } from '../composables/api'

const api = useWindowApi();

const workspaces = ref([]);

api.invoke('workspace:index').then(data => workspaces.value = data)

</script>
<template>
    <w-layout>
        <i-left-bar></i-left-bar>
        
        <w-content>
            content
        </w-content>

    </w-layout>
</template>