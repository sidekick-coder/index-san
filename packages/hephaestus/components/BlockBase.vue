<script lang="ts" setup>

const icon = defineProp('icon', {
    type: String,
    default: 'material-symbols:drag-indicator'
})

</script>

<template>
    <div class="flex group hover:bg-body-600/25 py-4 min-h-14">

        <div class="w-10 flex items-center justify-center text-body-500">
            <is-icon :name="icon" />
        </div>

        <div class="flex-1 flex">
            <slot />
            
        </div>

    </div>
</template>
