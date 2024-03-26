<script lang="ts" setup>
import { computed, ref, shallowRef, watch } from 'vue';

const model = defineModel<string>({
    type: String,
    default: '',
})

const context = defineProp<any>('context', {
    type: Object,
    default: () => ({})
})

// render
const instance = shallowRef<any>(null)

function setInstance(){
    instance.value = {
        setup: () => context.value,
        template: model.value,
    }
}

watch(model, setInstance, { immediate: true })
</script>

<template>
    <component v-if="instance" :is="instance"></component>
</template>
