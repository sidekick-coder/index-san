<script lang="ts" setup>

const icon = defineProp('icon', {
    type: String,
    default: 'material-symbols:drag-indicator'
})

const emit = defineEmits(['click:icon'])

</script>

<template>
    <div class="flex items-center group py-4 transition-all px-10">
        <div
            class="absolute left-0 top-0 w-10 h-full flex items-center justify-center text-body-500 group-hover:text-body-100"
            @click="$emit('click:icon')"
        >
            <is-icon :name="icon" />
        </div>

        <slot />
    </div>
</template>
