<script lang="ts" setup>

const icon = defineProp('icon', {
    type: String,
    default: 'material-symbols:drag-indicator'
})

</script>

<template>
    <div class="flex items-center group hover:bg-body-600/25 py-4 transition-all">

        <div class="w-10 flex items-center justify-center text-body-500">
            <is-icon :name="icon" />
        </div>

        <div class="flex-1 flex items-center">
            <slot />
            
        </div>

    </div>
</template>
