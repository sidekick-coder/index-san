<script setup lang="ts">
import { ref, computed } from 'vue'
import { openURL } from '@/composables/externals'

import { useVModel } from '@vueuse/core'

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

// model
const model = useVModel(props, 'modelValue', emit)

const edit = ref(false)

function isValid(url: string) {
    try {
        new URL(url)
        return true
    } catch (error) {
        return false
    }
}

// display
const display = computed(() => {
    if (!model.value) return

    if (!isValid(model.value)) {
        return model.value
    }

    const url = new URL(props.modelValue)

    return url.hostname || url.href
})
</script>

<template>
    <v-input v-if="edit" v-model="model">
        <template #append>
            <v-btn size="text-xs px-2 " text @click="edit = false">
                <v-icon name="check" />
            </v-btn>
        </template>
    </v-input>

    <v-input
        v-else
        :model-value="display"
        class="cursor-pointer group/input"
        :input:class="!isValid(model) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        readonly
        @click="openURL(model)"
    >
        <template #append>
            <v-btn
                size="text-xs px-2  group-hover/input:opacity-100 opacity-0"
                text
                @click.stop="edit = true"
            >
                <v-icon name="pen" />
            </v-btn>
        </template>
    </v-input>
</template>
