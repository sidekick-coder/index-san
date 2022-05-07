<script setup lang="ts">
import {useItemStore } from '../stores/item'

const store = useItemStore();


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