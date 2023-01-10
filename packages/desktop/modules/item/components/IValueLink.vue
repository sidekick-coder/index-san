<script setup lang="ts">
import { ref, computed } from 'vue'
import { openURL } from '@/composables/externals'
import { createValue } from '../composables/value'

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
})

const { payload, onLoaded, save } = createValue(props)

await new Promise<void>((resolve) => onLoaded(resolve))

const edit = ref(false)

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
</script>

<template>
    <v-input v-if="edit" v-model="payload" @update:model-value="save">
        <template #append>
            <v-btn size="text-xs px-2 " text @click="edit = false">
                <v-icon name="check" />
            </v-btn>
        </template>
    </v-input>

    <div
        v-else
        :model-value="display"
        :class="!isValid(payload) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        class="cursor-pointer group/input flex"
        @click="openURL(payload as string)"
    >
        {{ display }}

        <v-btn
            size="sm"
            class="group-hover/input:opacity-100 opacity-0 ml-auto"
            color="b-secondary"
            @click.stop="edit = true"
        >
            <v-icon name="pen" />
        </v-btn>
    </div>
</template>
