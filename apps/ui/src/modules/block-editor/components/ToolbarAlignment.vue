<script setup lang="ts">
import ToolbarBtn from './ToolbarBtn.vue'

const model = defineModel({
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
})
</script>
<template>
    <ToolbarBtn :active="model === 'left'" @click="model = 'left'">
        <v-icon class="text-base" name="ph:align-left-fill" />
    </ToolbarBtn>

    <ToolbarBtn :active="model === 'center'" @click="model = 'center'">
        <v-icon class="text-base" name="ph:align-center-horizontal-fill" />
    </ToolbarBtn>

    <ToolbarBtn :active="model === 'right'" @click="model = 'right'">
        <v-icon class="text-base" name="ph:align-right-fill" />
    </ToolbarBtn>
</template>
