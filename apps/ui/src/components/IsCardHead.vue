<script setup lang="ts">
// general
const className = defineProp<string>('class', {
    type: String,
    default: null,
})

const { set, classes } = useClassBuilder({ class: className })

set('base', 'card-head flex items-center')

</script>
<template>
    <div :class="classes">
        <slot />
    </div>
</template>
