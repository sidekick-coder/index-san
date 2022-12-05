<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Script from '@core/entities/script'
import { useMeta } from '@/composables/metas'
import { useCase } from '@/composables/use-case'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
})

const router = useRouter()
const tm = useI18n()
const meta = useMeta({
    title: 'Scripts list',
})

const items = ref<Script[]>([])
const search = ref('')
const dialog = ref(false)
const payload = ref({
    name: '',
    content: '',
})

const filteredItems = computed(() => items.value.filter((i) => i.name.match(search.value)))

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

async function setItems() {
    await useCase('list-scripts', { workspaceId: props.workspaceId }).then(
        ({ data }) => (items.value = data)
    )
}

setItems()

async function submit() {
    await useCase('create-script', {
        workspaceId: props.workspaceId,
        data: payload.value,
    })

    payload.value.name = ''

    await setItems()

    dialog.value = false
}

async function onItemDelete(item: Script) {
    await useCase('delete-script', {
        workspaceId: props.workspaceId,
        name: item.name,
    })

    await setItems()
}

async function onItemShow(item: Script) {
    await router.push(`/workspaces/${props.workspaceId}/scripts/${item.name}`)
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

    <is-table :columns="columns" :items="filteredItems">
        <template #item-actions="{ item }">
            <div class="px-2 flex">
                <is-btn text size="sm" @click="onItemShow(item)">
                    <is-icon name="eye" />
                </is-btn>
                <is-btn text size="sm" color="danger" @click="onItemDelete(item)">
                    <is-icon name="trash" />
                </is-btn>
            </div>
        </template>
    </is-table>
</template>
