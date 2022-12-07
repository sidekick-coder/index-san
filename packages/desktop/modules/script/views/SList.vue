<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Script from '@core/entities/script'
import { useMeta } from '@/composables/metas'
import { useStore } from '@/modules/script/store'

// set table columns
const tm = useI18n()

const columns = [
    {
        name: 'name',
        label: tm.t('name'),
        field: 'name',
        padding: {
            left: 40,
        },
    },
    {
        name: 'actions',
    },
]

// set meta
const meta = useMeta({
    title: 'Scripts list',
})

// Create script
const store = useStore()

const dialog = ref(false)

const payload = ref({
    name: '',
})

async function submit() {
    await store.create({
        data: {
            name: payload.value.name,
            content: '// write script bellow',
        },
    })

    payload.value.name = ''
    dialog.value = false
}

// delete item
async function onItemDelete(item: Script) {
    await store.destroy({
        name: item.name,
    })
}
</script>
<template>
    <is-dialog v-model="dialog">
        <w-form @submit="submit">
            <is-card color="b-secondary">
                <is-card-content class="flex flex-wrap">
                    <is-input v-model="payload.name" class="mb-4" label="Name" />

                    <is-btn class="w-full">Create</is-btn>
                </is-card-content>
            </is-card>
        </w-form>
    </is-dialog>

    <is-container class="w-full py-5 border-b border-lines flex items-center">
        <div class="text-2xl font-bold">
            {{ meta.title }}
        </div>

        <is-btn class="ml-auto" @click="dialog = true">
            {{ $t('addEntity', ['script']) }}
        </is-btn>
    </is-container>

    <is-table :columns="columns" :items="store.scripts">
        <template #item-actions="{ item }">
            <div class="px-2 flex">
                <is-btn text size="sm" :to="`/scripts/${item.id}`">
                    <is-icon name="eye" />
                </is-btn>
                <is-btn text size="sm" color="danger" @click="onItemDelete(item)">
                    <is-icon name="trash" />
                </is-btn>
            </div>
        </template>
    </is-table>
</template>
