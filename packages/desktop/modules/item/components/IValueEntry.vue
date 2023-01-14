<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
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

const { payload, column, item, save, onLoaded } = createValue<string | null>(props)

await new Promise<void>((resolve) => onLoaded(resolve))

// upload
const store = useStore()

async function deleteEntry() {
    if (!payload.value) return

    await store.entry.destroy({ path: payload.value })

    payload.value = null
}

function pickFile() {
    const input = document.createElement('input')

    input.type = 'file'

    input.click()

    input.onchange = () => {
        if (!input.files || !input.files[0]) return

        const file = input.files[0]

        upload(file)
    }
}

async function upload(file: File) {
    if (!column.value || !item.value) return

    const filePattern = column.value.filename || `${uuid()}.{ext}`

    const compiled = template(filePattern, {
        interpolate: /{{([\s\S]+?)}}/g,
    })

    const filename = compiled({
        ext: DirectoryEntry.extname(file.name),
        item: item.value,
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

    await save()
}

// clipboard upload

async function uploadByClipboard() {
    const [item] = await navigator.clipboard.read()

    const type = item.types.find((i) => i.includes('image'))

    if (!type) return

    const [, ext] = type.split('/')

    const blob = await item.getType(type)

    const file = new File([blob], `image.${ext}`)

    await upload(file).catch((err) => store.notify.error(err.message))
}
</script>

<template>
    <v-menu offset-y close-on-content-click>
        <template #activator="{ attrs }">
            <div class="cursor-pointer" v-bind="{ ...$attrs, ...attrs }">
                {{ !payload ? '' : DirectoryEntry.basename(payload) }}
            </div>
        </template>

        <v-card color="b-secondary" class="drop-shadow-xl">
            <v-list-item @click="pickFile">
                <v-icon name="upload" class="mr-4" />

                {{ $t('upload') }}
            </v-list-item>

            <v-list-item @click="uploadByClipboard">
                <v-icon name="paste" class="mr-4" />

                {{ $t('pasteEntity', [$t('image')]) }}
            </v-list-item>

            <v-list-item @click="deleteEntry">
                <v-icon name="trash" class="mr-4" />

                {{ $t('deleteEntity', [$t('entry')]) }}
            </v-list-item>
        </v-card>
    </v-menu>
</template>
