<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits

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
        type: Array as () => any[],
        default: () => [],
    },
    labelKey: {
        type: String,
        default: null,
    },
    valueKey: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

// Selection

const menu = ref(false)
const model = useVModel(props, 'modelValue', emit)

function onSelect(option: any) {
    model.value = option.value

    menu.value = false
}

// Options

const optionsFormatted = computed(() => {
    return props.options.map((option) => ({
        label: props.labelKey ? option[props.labelKey] : option,
        value: props.valueKey ? option[props.valueKey] : option,
    }))
})

// Elements attrs

const attrs = useAttrs()

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
            <is-list-item
                v-for="option in optionsFormatted"
                :key="option"
                dark
                @click="onSelect(option)"
            >
                {{ option.label }}
            </is-list-item>
        </is-card>
    </is-menu>
</template>
