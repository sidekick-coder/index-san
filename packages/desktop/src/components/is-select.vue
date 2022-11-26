<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: 'accent',
    },
    flat: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)

// menu

const menu = ref(false)

// select
function onSelect(option) {
    model.value = option

    menu.value = false
}
</script>
<template>
    <is-menu v-model="menu" offset-y>
        <template #activator="{ on }">
            <is-input
                v-bind="on"
                v-model="model"
                :label="label"
                :color="color"
                :flat="flat"
                readonly
            />
        </template>

        <is-card color="b-secondary" class="min-w-[200px]">
            <is-list-item v-for="option in options" :key="option" dark @click="onSelect(option)">
                {{ option }}
            </is-list-item>
        </is-card>
    </is-menu>
</template>
