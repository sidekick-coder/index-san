<script setup lang="ts">
import { ref } from 'vue'
import { useWindowApi } from '../composables/api'

const api = useWindowApi();
const workspaces = ref([]);

async function setWorkspaces(){
    const data = await api.invoke('workspace:index')

    workspaces.value = data
}


</script>

<template>
<w-drawer layout width="[300px]">
    <ul>
        <h1 class="text-2xl font-bold">Index-san</h1>

        <li v-for="workspace in workspaces">
            {{ workspace.name }}
        </li>
    </ul>
</w-drawer>

</template>

