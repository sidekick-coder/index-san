<script setup lang="ts" generic="T = Record<string, string>">
import merge from 'lodash/merge'
import { twMerge } from 'tailwind-merge';

defineOptions({
    inheritAttrs: false,
})

// general
const className = defineProp<string>('class', {
    type: String,
    default: '',
})

// options
const options = defineProp<T[]>('options', {
    type: Array as PropType<T[]>,
    default: () => [],
})

const labelKey = defineProp<keyof T>('labelKey', {
    type: String as unknown as PropType<keyof T>,
    default: 'label',
})

const valueKey = defineProp<keyof T>('valueKey', {
    type: String as unknown as PropType<keyof T>,
    default: 'value',
})

function findLabel(option: T) {
    return option[labelKey.value as keyof T] as string
}

function findValue(option: T) {
    return option[valueKey.value as keyof T]
}

// model
const model = defineModel<any>()

const menu = ref(false)

const modelMultiple = defineModel('multiple', {
    type: Array as PropType<any[]>,
    default: null,
})

const displayValue = computed(() => {
    if (!modelMultiple.value) {
        const option = options.value.find((o) => findValue(o) === model.value)

        return option ? findLabel(option) : ''
    }

    return modelMultiple.value.map((o) => findLabel(o)).join(', ')
})

function select(option: T) {
    if (!modelMultiple.value) {
        model.value = findValue(option)
        menu.value = false
        return
    }

    const index = modelMultiple.value.findIndex((o) => findValue(o) === findValue(option))

    if (index === -1) {
        modelMultiple.value.push(option)
    }

    if (index !== -1) {
        modelMultiple.value.splice(index, 1)
    }
}

// others
const label = defineProp<string>('label', {
    type: String,
    default: '',
})

const readonly = defineProp<boolean>('readonly', {
    type: Boolean,
    default: false,
})

const disabled = defineProp<boolean>('disabled', {
    type: Boolean,
    default: false,
})
</script>

<template>
    <is-menu
        v-model="menu"
        :open-on-click="!readonly && !disabled"
        :close-on-content-click="false"
        :transition-attrs="{
            enterActiveClass: 'transition ease-out duration-100',
            leaveActiveClass: 'transition ease-in duration-100',
            enterFromClass: 'opacity-0 translate-y-2',
            leaveToClass: 'opacity-0 translate-y-2',
        }"
    >
        <template #activator="menuProps">
            <is-input
                :label="label"
                :model-value="displayValue"
                :class="twMerge('cursor-pointer', className)"
                :disabled="disabled"
                readonly
                v-bind="merge({}, $attrs, menuProps.attrs)"
            >
                <template #default>
                    <input
                        class="w-full cursor-pointer bg-transparent px-4 py-2 focus:outline-none"
                        readonly
                        :value="displayValue"
                    >
                </template>

                <template #append>
                    <is-icon
                        name="chevron-down"
                        class="text-2xl"
                    />
                </template>
            </is-input>
        </template>

        <template #default="{ activatorRects }">
            <is-card
                :style="{ 'min-width': `${activatorRects?.width}px` }"
                color="none"
                class="bg-body-900 [.bg-body-900_&]:bg-body-500"
            >
                <is-list-item
                    v-for="(o, index) in options"
                    :key="index"
                    @click.prevent="select(o)"
                >
                    {{ findLabel(o) }}
                </is-list-item>
            </is-card>
        </template>
    </is-menu>
</template>
