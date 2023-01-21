<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { createBindings } from '@composables/binding'
import { computed, ref, useAttrs, PropType } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: [String, Number, Object, Boolean] as PropType<any>,
        default: '',
    },
    readonly: {
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
    noChevron: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    clearValue: {
        type: [Function] as PropType<() => any>,
        default: () => () => undefined,
    },
})

const emit = defineEmits(['update:modelValue'])

// Bindings

const bindings = computed(() => createBindings(useAttrs(), ['menu', 'card']))

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

// display label

const displayValue = computed(() => {
    let label: any = model.value

    if (!label) {
        return label
    }

    if (props.returnObject) {
        return model.value[props.labelKey]
    }

    if (!props.labelKey || !props.valueKey) {
        return label
    }

    const option = props.options.find((o) => o[props.valueKey] === model.value)

    return option ? option[props.labelKey] : option
})

function onShowMenu(value: boolean) {
    if (props.readonly) return

    menu.value = value
}
</script>
<template>
    <v-menu
        :model-value="menu"
        max-height="132"
        v-bind="bindings.menu"
        close-on-content-click
        @update:model-value="onShowMenu"
    >
        <template #activator="{ attrs, toggle }">
            <slot
                name="selection"
                :attrs="{ ...attrs, ...bindings.root }"
                :display-value="displayValue"
            >
                <v-input
                    v-bind="{ ...attrs, ...bindings.root }"
                    :model-value="displayValue"
                    class="cursor-pointer"
                    input:class="cursor-pointer"
                    readonly
                    @keydown.enter="toggle"
                    @keydown.esc="menu = false"
                >
                    <template v-if="!noChevron" #append>
                        <v-icon name="chevron-down" class="ml-auto text-t-secondary" />
                    </template>
                </v-input>
            </slot>
        </template>

        <v-card color="b-secondary" v-bind="bindings.card">
            <v-list-item
                v-if="clearable"
                class="border-b border-lines"
                @click="model = clearValue()"
            >
                {{ $t('clear') }}
            </v-list-item>

            <v-list-item v-if="!options.length">
                {{ $t('noEntity', [$t('item', 2)]) }}
            </v-list-item>

            <template v-for="option in options" :key="option">
                <slot
                    name="option"
                    :option="option"
                    :attrs="{
                        onClick: () => onSelect(option),
                    }"
                >
                    <v-list-item dark @click="onSelect(option)">
                        {{ getLabel(option) }}
                    </v-list-item>
                </slot>
            </template>
        </v-card>
    </v-menu>
</template>
