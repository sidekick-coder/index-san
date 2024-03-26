
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import BlockBase from './BlockBase.vue';


const error = ref(false)
const errorMessage = ref('')

onErrorCaptured((e) => {
    error.value = true
    errorMessage.value = e.message
    return false
})

</script>

<template>
    <BlockBase v-if="error">
        <div class="text-red-500">{{ errorMessage }}</div>
    </BlockBase>
    <div v-else><slot></slot></div>
  </template>
  
