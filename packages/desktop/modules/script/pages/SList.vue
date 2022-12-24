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
    <v-dialog v-model="dialog">
        <w-form @submit="submit">
            <v-card color="b-secondary">
                <v-card-content class="flex flex-wrap">
                    <v-input v-model="payload.name" class="mb-4" label="Name" />

                    <v-btn type="submit" class="w-full">Create</v-btn>
                </v-card-content>
            </v-card>
        </w-form>
    </v-dialog>

    <v-container class="w-full py-4 border-b border-lines flex items-center">
        <div class="text-2xl font-bold">
            {{ meta.title }}
        </div>

        <v-btn class="ml-auto" @click="dialog = true">
            {{ $t('addEntity', ['script']) }}
        </v-btn>
    </v-container>

    <v-table :columns="columns" :items="store.scripts">
        <template #item-actions="{ item }">
            <v-td class="px-2 flex">
                <v-btn text size="sm" :to="`/scripts/${item.id}`">
                    <v-icon name="eye" />
                </v-btn>
                <v-btn text size="sm" color="danger" @click="onItemDelete(item)">
                    <v-icon name="trash" />
                </v-btn>
            </v-td>
        </template>
    </v-table>
</template>
