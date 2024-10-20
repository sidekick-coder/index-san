<script lang="ts" setup>
import merge from 'lodash/merge'
import { Mask, type MaskOptions } from 'maska'
import { twMerge } from 'tailwind-merge';

// general
const className = defineProp<string>('class', {
    type: String,
    default: null,
})

const classMap = ref(new Map<string, string>())

const classes = computed(() => {
    const all = Array.from(classMap.value.values()).join(' ')

    return twMerge(all, className.value)
})

classMap.value.set(
    'base',
    `
    flex-1
    px-4 py-2
    bg-transparent
    outline-none
    placeholder:text-body-300
    `
)

// mask
const mask = defineProp<string>('mask', {
    type: String,
    default: null,
})

const maskOptions = defineProp<MaskOptions>('maskOptions', {
    type: Object,
    default: null,
})

const defaultMaskOptions: MaskOptions = {
    tokens: {
        '#': { pattern: /[0-9]/ }, // digits
        '@': { pattern: /[a-zA-Z]/ }, // letters
        '*': { pattern: /[a-zA-Z0-9]/ }, // letters & digits
        0: { pattern: /[0-9]/, optional: true },
        9: { pattern: /[0-9]/, repeated: true },
    },
}

const maskInstance = computed(() => {
    if (!mask.value) return null

    return new Mask(
        merge(defaultMaskOptions, maskOptions.value, {
            mask: mask.value,
        })
    )
})

// model
const inputRef = ref<HTMLInputElement | null>(null)

const [model, modifiers] = defineModel<string | number, 'lazy' | 'number' | 'masked'>({
    type: [String, Number],
    default: null,
    get: (value) => {
        if (!maskInstance.value) {
            return value
        }

        return maskInstance.value.masked(String(value))
    },
    set: (value) => {
        if (!maskInstance.value) {
            return value
        }

        const unmasked = maskInstance.value.unmasked(String(value))

        if (modifiers.number) {
            return Number(unmasked)
        }

        if (modifiers.masked) {
            return maskInstance.value.masked(unmasked)
        }

        return unmasked
    },
})

function onInput(event: Event) {
    if (modifiers.lazy) return

    const target = event.target as HTMLInputElement

    model.value = target.value

    if (target.value !== model.value) {
        target.value = model.value
    }
}

function onChange(event: Event) {
    if (!modifiers.lazy) return

    const target = event.target as HTMLInputElement

    model.value = target.value
}

// others
const type = defineProp<string>('type', {
    type: String,
    default: 'text',
})

const placeholder = defineProp<string>('placeholder', {
    type: String,
    default: null,
})

const disabled = defineProp<boolean>('disabled', {
    type: Boolean,
    default: false,
})

const readonly = defineProp<boolean>('readonly', {
    type: Boolean,
    default: false,
})
</script>

<template>
    <is-input v-bind="$props">
        <template #default="{ id }">
            <input
                :id="id"
                ref="inputRef"
                :type="type"
                :class="classes"
                :placeholder="placeholder"
                :value="model"
                :disabled="disabled"
                :readonly="readonly"
                @input="onInput"
                @change="onChange"
            >
        </template>
    </is-input>
</template>
