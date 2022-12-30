<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

const { payload, load, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

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
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
    />

    <v-input v-else-if="edit" v-model="payload">
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
        :input:class="!isValid(payload) ? 'text-danger cursor-pointer' : 'cursor-pointer'"
        readonly
        @click="openURL(payload as string)"
    >
        <template #append>
            <v-btn
                size="sm"
                class="group-hover/input:opacity-100 opacity-0"
                color="b-secondary"
                @click.stop="edit = true"
            >
                <v-icon name="pen" />
            </v-btn>
        </template>
    </v-input>
</template>
