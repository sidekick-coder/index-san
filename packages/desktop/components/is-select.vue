<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
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
    returnObject: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

// Selection

const menu = ref(false)
const model = useVModel(props, 'modelValue', emit)

function getValue(option: any) {
    if (props.returnObject) {
        return option
    }

    if (props.valueKey) {
        return option[props.valueKey]
    }

    return option
}

function onSelect(option: any) {
    model.value = getValue(option)

    menu.value = false
}

// display options

function getLabel(option: any) {
    if (props.labelKey) {
        return option[props.labelKey]
    }

    return option
}

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

// display label

const displayLabel = computed(() => {
    let label: any = model.value

    if (!label) {
        return label
    }

    if (props.returnObject) {
        label = model.value[props.labelKey]
    }

    return label
})
</script>
<template>
    <is-menu v-model="menu" max-height="132">
        <template #activator="{ on }">
            <is-input
                v-bind="on"
                :model-value="displayLabel"
                :label="label"
                :color="color"
                :flat="flat"
                readonly
                class="cursor-pointer"
                input:class="cursor-pointer max-w-[calc(100%_-_32px)]"
            >
                <template #append>
                    <is-icon name="chevron-down" class="ml-auto" />
                </template>
            </is-input>
        </template>

        <v-card color="b-secondary" v-bind="bindings.card">
            <is-list-item v-for="option in options" :key="option" dark @click="onSelect(option)">
                {{ getLabel(option) }}
            </is-list-item>
        </v-card>
    </is-menu>
</template>
