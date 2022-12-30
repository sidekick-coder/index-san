<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { watch } from 'vue'
import template from 'lodash/template'
import uuid from 'uuid-random'

import DirectoryEntry from '@core/entities/directory-entry'

import { createValue } from '@/modules/item/composables/value'
import { useStore } from '@/store/global'

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

const { payload, load, column, item, loading } = createValue<string | null>()

watch(props, load, {
    deep: true,
    immediate: true,
})

// upload
const store = useStore()

async function deleteEntry() {
    if (!payload.value) return

    await store.entry.destroy({ path: payload.value })

    payload.value = null
}

function upload() {
    if (!column.value || !item.value) return

    const input = document.createElement('input')

    const filePattern = column.value.filename || `${uuid()}.{ext}`
    const itemPath = item.value._path

    input.type = 'file'

    input.onchange = async () => {
        if (!input.files || !input.files[0]) return

        const file = input.files[0]

        const compiled = template(filePattern, {
            interpolate: /{([\s\S]+?)}/g,
        })

        const filename = compiled({
            ext: DirectoryEntry.extname(file.name),
            itemPath: itemPath,
        })

        const path = DirectoryEntry.normalize(filename)

        const buffer = await file.arrayBuffer()

        await store.entry.write({
            path,
            data: new Uint8Array(buffer),
        })

        if (filename !== payload.value) {
            await deleteEntry().catch(Boolean)
        }

        payload.value = path
    }

    input.click()
}
</script>

<template>
    <v-input
        v-if="loading.all"
        :model-value="`${$t('loading')}...`"
        class="text-t-secondary text-sm"
        readonly
        v-bind="$attrs"
    />

    <v-menu v-else offset-y close-on-content-click>
        <template #activator="{ attrs }">
            <v-input
                :model-value="!payload ? '' : DirectoryEntry.basename(payload)"
                readonly
                class="cursor-pointer"
                input:class="cursor-pointer"
                v-bind="{ ...$attrs, ...attrs }"
            >
            </v-input>
        </template>
        <v-card color="b-secondary">
            <v-list-item @click="upload">
                {{ $t('upload') }}
            </v-list-item>
            <v-list-item @click="deleteEntry">
                {{ $t('deleteEntity', [$t('entry')]) }}
            </v-list-item>
        </v-card>
    </v-menu>
</template>
