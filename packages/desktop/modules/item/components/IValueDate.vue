<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createValue } from '../composables/value'
import moment from 'moment'

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

const { payload, load, column, loading } = createValue()

watch(props, load, {
    deep: true,
    immediate: true,
})

const edit = ref(false)

function isValid(value: any) {
    if (!column.value) return true

    return moment(value, column.value.saveFormat, true).isValid()
}

// display
const display = computed(() => {
    if (!payload.value || !column.value) return ''

    const { saveFormat, displayFormat } = column.value

    return moment(payload.value, saveFormat).format(displayFormat)
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
            <v-btn size="sm" color="b-secondary" @click="edit = false">
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
    >
        <template #append>
            <v-btn
                size="sm"
                color="b-secondary"
                class="group-hover/input:opacity-100 opacity-0"
                @click.stop="edit = true"
            >
                <v-icon name="pen" />
            </v-btn>
        </template>
    </v-input>
</template>
