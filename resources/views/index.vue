<script setup lang="ts">
import { ref } from 'vue'

import { useWindowApi  } from '../composables/api'

const api = useWindowApi();

const message = ref('');


api.invoke('app:info').then(info => message.value = info)

</script>
<template>
    <div>Hello word {{ message }}</div>
</template>