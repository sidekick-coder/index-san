<script setup lang="ts">
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useVModel } from 'vue-wind/composables/v-model'
import { computed, ref } from 'vue'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

// model

const model = useVModel(props, 'modelValue', emit)

// menu

const menu = ref(false)

// options
const max = 100
const options: string[] = []

const search = ref('')
const limit = ref(max)

const filteredOptions = computed(() => options.filter((o) => o.match(search.value)))

Object.values(fas)
    .slice(10)
    .filter((i) => !!i.prefix && !!i.iconName)
    .map((i) => `${i.prefix} fa-${i.iconName}`)
    .filter((i, index, array) => array.indexOf(i) === index)
    .forEach((name) => {
        options.push(name)
    })

// selection
function onSelect(option: string) {
    menu.value = false
    model.value = option
}
</script>
<template>
    <v-menu v-model="menu" offset-y>
        <template #activator="{ attrs }">
            <slot name="activator" :attrs="attrs">
                <v-btn class="w-[32px] h-[32px]" v-bind="attrs">
                    <v-icon v-if="model" :name="model"></v-icon>
                    <v-icon v-else name="dice"></v-icon>
                </v-btn>
            </slot>
        </template>

        <v-card
            class="max-h-[300px] overflow-y-auto flex items-baseline flex-wrap bg-b-secondary"
            width="300"
        >
            <v-input
                v-model="search"
                :placeholder="$t('search')"
                flat
                class="border-b border-lines text-sm w-full"
            />

            <v-btn
                v-for="option in filteredOptions.slice(0, limit)"
                :key="option"
                class="w-8 h-8"
                text
                @click="onSelect(option)"
            >
                <v-icon :name="option"></v-icon>
            </v-btn>

            <v-btn
                v-if="filteredOptions.length > max"
                class="w-full mx-2 my-2"
                size="sm"
                outlined
                @click="limit += max"
            >
                {{ $t('loadMore') }}...
            </v-btn>
        </v-card>
    </v-menu>
</template>
