<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
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
const attrs = useAttrs()

const model = useVModel(props, 'modelValue', emit)

// menu

const menu = ref(false)

// select
function onSelect(option) {
    model.value = option

    menu.value = false
}

// card attrs

const bindings = computed(() => {
    const wrapper = {}
    const card = {}

    Object.keys(attrs)
        .filter((key) => key.startsWith('card:'))
        .forEach((key) => {
            if (key.startsWith('card:')) {
                card[key.replace('card:', '')] = attrs[key]
            }
        })

    return {
        wrapper,
        card,
    }
})
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
                class="cursor-pointer"
                input:class="cursor-pointer"
            >
                <template #append>
                    <is-icon name="chevron-down" class="ml-auto" />
                </template>
            </is-input>
        </template>

        <is-card color="b-secondary" v-bind="bindings.card">
            <is-list-item v-for="option in options" :key="option" dark @click="onSelect(option)">
                {{ option }}
            </is-list-item>
        </is-card>
    </is-menu>
</template>
