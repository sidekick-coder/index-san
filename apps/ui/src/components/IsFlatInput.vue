<script setup lang="ts">
const model = defineModel({
    type: [String, Number] as PropType<string | number>,
    default: '',
})

const className = defineProp('class', {
    type: String,
    default: '',
})

const { set, classes } = useClassBuilder({ class: className })

set('base', 'bg-transparent size-full outline-none focus:ring-0')

</script>
<template>
    <input
        v-model="model"
        :class="classes"
    >
</template>
