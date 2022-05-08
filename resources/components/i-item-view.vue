<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '../stores/workspace'
import { useWindowApi } from '../composables/api'

const store = useWorkspaceStore();
const api = useWindowApi();

const item = ref(null)

</script>
<template>
    <div class="p-10">
        <div v-if="!store.current">
            No items selected
        </div>
        
        <div v-else>
            {{ store.current }}
        </div>
    </div>  
</template>