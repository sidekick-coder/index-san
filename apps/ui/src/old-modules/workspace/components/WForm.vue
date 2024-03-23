<script setup lang="ts">
import Workspace from '@index-san/core/entities/workspace'

import { useStore } from '@store/global'
import { createBindings } from '@composables/binding'
import { useConfig } from '@composables/use-config'
import { useNonReactive } from '@composables/utils'

// Props & emits

const props = defineProps({
    editedItem: {
        type: Object as () => Workspace,
        default: null,
    },
})

const emit = defineEmits(['created', 'updated'])

// bindings

const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['browse-btn']))

// submit

const store = useStore()

const payload = ref<Omit<Workspace, 'id'>>({
    name: '',
    driveName: 'local',
    config: {
        path: '',
    },
})

async function create() {
    const workspace = await store.workspace.create(useNonReactive(payload.value))

    emit('created', workspace)
}

async function update() {
    if (!props.editedItem) return

    await store.workspace.update(props.editedItem.id, useNonReactive(payload.value))

    emit('updated')
}

async function submit() {
    if (props.editedItem) {
        return await update()
    }

    await create()
}

// pick file

const config = useConfig()

async function pickFolder() {
    const result = await config.open.directory()

    console.log(result)

    payload.value.config = result
}

// set edited item

watch(
    () => props.editedItem,
    (data) => {
        if (data) {
            payload.value = useNonReactive(data)
            return
        }

        payload.value.name = ''
        payload.value.driveName = 'local'
        payload.value.config.path = ''
    },
    { immediate: true }
)
</script>

<template>
    <v-card>
        <slot name="head">
            <v-card-head class="px-4">
                <v-card-title>
                    {{ $t('addEntity', [$t('workspace').toLocaleLowerCase()]) }}
                </v-card-title>
            </v-card-head>
        </slot>

        <v-card-content>
            <v-form
                class="flex flex-wrap gap-y-4 w-full"
                @submit="submit"
            >
                <v-input
                    v-model="payload.name"
                    :label="$t('name')"
                />

                <v-select
                    v-model="payload.driveName"
                    :label="$t('drive')"
                    :options="store.drive.drives"
                    label-key="label"
                    value-key="id"
                    card:color="b-primary"
                    menu:offset-y
                />

                <v-input
                    v-model="payload.config.displayName"
                    :label="$t('path')"
                    :disabled="!!editedItem"
                >
                    <template #append>
                        <v-btn
                            size="sm"
                            color="b-primary"
                            v-bind="bindings['browse-btn']"
                            :disabled="!!editedItem"
                            @click="pickFolder"
                        >
                            {{ $t('browse') }}
                        </v-btn>
                    </template>
                </v-input>

                <v-btn
                    :disabled="!payload.name || !payload.config.path"
                    class="w-full"
                    type="submit"
                >
                    {{ editedItem ? $t('save') : $t('create') }}
                </v-btn>
            </v-form>
        </v-card-content>
    </v-card>
</template>
