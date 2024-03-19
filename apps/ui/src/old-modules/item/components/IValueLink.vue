<script setup lang="ts">
import { ref, computed } from 'vue'
import { openURL } from '@composables/externals'
import { createValue } from '../composables/value'
import { useModelOrInnerValue } from '@composables/model'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    edit: {
        type: Boolean,
        default: null,
    },
})

const emit = defineEmits(['update:edit'])

const { payload, onLoaded, save } = createValue(props)

await new Promise<void>((resolve) => onLoaded(resolve))

const innerEdit = ref(false)

function isValid(url: any) {
    try {
        new URL(url)
        return true
    } catch (error) {
        return false
    }
}

// display
const display = computed(() => {
    if (!payload.value) return

    if (!isValid(payload.value)) {
        return payload.value
    }

    const url = new URL(payload.value)

    return url.hostname || url.href
})

// edit model

const showInput = useModelOrInnerValue(props, 'edit', emit)

const editValue = ref(false)
</script>

<template>
    <v-input
        v-if="editValue"
        v-model="payload"
        @update:model-value="save"
    >
        <template #append>
            <v-btn
                size="none"
                class="text-xs px-2"
                text
                @click="editValue = false"
            >
                <v-icon name="check" />
            </v-btn>
        </template>
    </v-input>

    <v-input
        v-else-if="showInput"
        :model-value="display"
        class="cursor-pointer group/input"
        input:class="cursor-pointer"
        readonly
        @click="openURL(payload as string)"
    >
        <template #append>
            <v-btn
                size="sm"
                class="group-hover/input:opacity-100 opacity-0 ml-auto"
                color="b-secondary"
                @click.stop="editValue = true"
            >
                <v-icon name="pen" />
            </v-btn>
        </template>
    </v-input>

    <div
        v-else
        :class="!isValid(payload) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        class="cursor-pointer group/input flex"
        @click="openURL(payload as string)"
    >
        {{ display }}

        <v-btn
            size="sm"
            class="group-hover/input:opacity-100 opacity-0 ml-auto"
            color="b-secondary"
            @click.stop="innerEdit = true"
        >
            <v-icon name="pen" />
        </v-btn>
    </div>
</template>
