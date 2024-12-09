
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import BlockBase from './BlockBase.vue';


const error = ref(false)
const errorMessage = ref('')
const stack = ref()

onErrorCaptured((e) => {
    error.value = true
    errorMessage.value = e.message
    console.error(e)
    return false
})

</script>

<template>
    <BlockBase v-if="error">
        <div class="text-red-500">
            {{ errorMessage }}
        </div>
    </BlockBase>
    <div v-else>
        <slot />
    </div>
</template>
  
