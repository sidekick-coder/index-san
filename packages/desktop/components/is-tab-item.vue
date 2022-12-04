<script>
export default {
    name: 'IsTabItem',
    props: {
        label: {
            type: String,
            default: '',
        },
    },
}
</script>

<template>
    <div class="px-2 py-4">
        <slot />
    </div>
</template>
