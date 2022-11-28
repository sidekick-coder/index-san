<script lang="ts">
export default {
    inheritAttrs: true,
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: [String, Number],
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
    readonly: {
        type: Boolean,
        default: false,
    },
    flat: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)

const attrs = useAttrs()

// input

const inputColors = {
    default: {
        accent: {
            normal: 'rounded outline outline-lines',
            focus: 'outline-accent',
        },
        danger: {
            normal: 'rounded outline outline-lines',
            focus: 'outline-danger',
        },
        info: {
            normal: 'rounded outline outline-lines',
            focus: 'outline-info',
        },
    },
    flat: {
        accent: {
            normal: 'bg-transparent',
            focus: 'bg-accent/20',
        },
        danger: {
            normal: 'bg-transparent',
            focus: 'bg-danger/20',
        },
        info: {
            normal: 'bg-transparent',
            focus: 'bg-info/20',
        },
    },
}

const input = ref({
    isFocus: false,
})

function onFocus() {
    input.value.isFocus = true
}

function onBlur() {
    input.value.isFocus = false
}

const classes = computed(() => {
    const result: string[] = ['transition-all py-2 px-4 bg-transparent w-full flex']

    let color = inputColors.default[props.color]

    if (props.flat) {
        color = inputColors.flat[props.color]
    }

    result.push(color.normal)

    if (input.value.isFocus) {
        result.push(color.focus)
    }

    return result
})

// label colors
const labelColors = {
    default: {
        accent: 'text-accent',
        danger: 'text-danger',
        info: 'text-info',
    },
}

const labelClasses = computed(() => {
    const result = ['text-t-secondary block font-bold text-sm mb-2']

    if (input.value.isFocus) {
        result.push(labelColors.default[props.color])
    }

    return result
})

// input attrs

const bindings = computed(() => {
    const wrapper = {}
    const label = {}
    const input = {}

    Object.keys(attrs).forEach((key) => {
        if (key.startsWith('input:')) {
            input[key.replace('input:', '')] = attrs[key]
            return
        }

        if (key.startsWith('label:')) {
            label[key.replace('label:', '')] = attrs[key]
            return
        }

        wrapper[key] = attrs[key]
    })

    return { wrapper, label, input }
})
</script>
<template>
    <div class="w-full" v-bind="bindings.wrapper">
        <label v-if="label" :for="label" :class="labelClasses" v-bind="bindings.label">
            {{ label }}
        </label>

        <div :class="classes">
            <input
                :id="label"
                v-model="model"
                :type="type"
                :placeholder="placeholder"
                :readonly="readonly"
                v-bind="bindings.input"
                class="bg-transparent outline-none grow max-w-full"
                @focus="onFocus"
                @blur="onBlur"
            />
            <slot name="append" />
        </div>
    </div>
</template>
