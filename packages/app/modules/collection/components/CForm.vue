<script setup lang="ts">
import { useNonReactive } from '@composables/utils'
import Collection, { RepositoryType } from '@core/entities/collection'
import { useStore } from '@store/global'

// Props & emits

const props = defineProps({
    editedItem: {
        type: Object as () => Collection,
        default: null,
    },
})

interface Emits {
    (e: 'created', collection: Collection): void
    (e: 'updated', collection: Collection): void
}

const emit = defineEmits<Emits>()

// submit

const store = useStore()

const payload = ref<Collection>({
    id: '',
    name: '',
    path: '',
    columns: [],
    repositoryType: RepositoryType.Entry,
})

async function create() {
    const collection = await store.collection.create({
        id: payload.value.id,
        repositoryType: RepositoryType.Entry,
        name: payload.value.name,
        path: payload.value.path,
        columns: [],
    })

    emit('created', collection)
}

async function update() {
    if (!props.editedItem) return

    const collection = await store.collection.update(props.editedItem.id, {
        id: payload.value.id,
        repositoryType: RepositoryType.Entry,
        name: payload.value.name,
        path: payload.value.path,
        columns: [],
    })

    emit('updated', collection)
}

async function submit() {
    if (!props.editedItem) {
        await create()
    }

    if (props.editedItem) {
        await update()
    }

    clear()
}

function clear() {
    payload.value.id = ''
    payload.value.name = ''
    payload.value.path = ''
    payload.value.columns = []
    payload.value.repositoryType = RepositoryType.Entry
}

// edited item

watch(
    () => props.editedItem,
    (collection) => {
        if (!collection) return clear()

        payload.value = useNonReactive(collection)
    },
    { immediate: true }
)
</script>
<template>
    <v-card color="b-secondary" width="500">
        <v-card-head class="px-4">
            <v-card-title>
                {{
                    editedItem
                        ? $t('editEntity', [$t('collection')])
                        : $t('addEntity', [$t('collection')])
                }}
            </v-card-title>
        </v-card-head>
        <v-card-content>
            <v-form class="w-full" @submit="submit">
                <div class="mb-4">
                    <v-input v-model="payload.id" label="ID" placeholder="collection-01" />
                </div>

                <div class="mb-4">
                    <v-input
                        v-model="payload.name"
                        :label="$t('name')"
                        placeholder="Collection 01"
                    />
                </div>

                <div class="mb-4">
                    <v-select
                        v-model="payload.repositoryType"
                        disabled
                        :label="$t('repositoryType')"
                        :options="[
                            {
                                label: $t('entry'),
                                value: RepositoryType.Entry,
                            },
                            {
                                label: $t('script'),
                                value: RepositoryType.Script,
                            },
                        ]"
                    />
                </div>

                <div class="mb-4">
                    <v-input
                        v-model="payload.path"
                        :label="$t('path')"
                        placeholder="/collections/collection-01"
                    />
                </div>

                <v-btn :disabled="!payload.name || !payload.path" class="w-full" type="submit">
                    {{ $t('create') }}
                </v-btn>
            </v-form>
        </v-card-content>
    </v-card>
</template>
