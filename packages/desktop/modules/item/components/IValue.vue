<script setup lang="ts">
import { computed, ref, watch, PropType } from 'vue'
import template from 'lodash/template'

import uuid from 'uuid-random'

import Column from '@core/entities/column'
import Item from '@core/entities/item'
import DirectoryEntry from '@core/entities/directory-entry'
import ExecuteScriptDTO from '@core/use-cases/execute-script/execute-script.dto'

import SOutput from '@/modules/script/components/SOutput.vue'
import EEntryIcon from '@/modules/entry/components/EEntryIcon.vue'

import { useVModel } from 'vue-wind/composables/v-model'
import { useStore } from '../store'

const props = defineProps({
    modelValue: {
        type: [String, Number, Object] as PropType<any>,
        default: null,
    },
    column: {
        type: Object as () => Column,
        required: true,
    },
    item: {
        type: Object as () => Item,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

// set value
const model = useVModel(props, 'modelValue', emit)

// Select options

const select = ref({
    options: computed(() => {
        if (props.column.type !== 'select') return []

        return props.column.options.split(',').map((o: string) => o.trim())
    }),
})

// Script options

const scriptLabel = computed(() => {
    if (props.column.type !== 'script') return null

    if (!model.value) return 'No result'

    if (typeof model.value !== 'object') return null

    if (model.value.result) return model.value.result

    if (model.value.error) return model.value.error.message

    return null
})

const scriptOutput = computed(() => {
    if (props.column.type !== 'script') return null

    if (!model.value) return null

    if (typeof model.value !== 'object') return null

    return model.value as ExecuteScriptDTO.Output
})

// relation options

const store = useStore()

const relation = ref({
    items: [] as Item[],
})

async function setRelation() {
    if (props.column.type !== 'relation') {
        relation.value.items = []
        return
    }

    await store
        .list({
            collectionId: props.column.collectionId,
        })
        .then((r) => (relation.value.items = r.data))
        .catch(() => (relation.value.items = []))
}

watch(() => props.column, setRelation, {
    immediate: true,
})

// entry

async function deleteEntry() {
    if (!model.value) return

    await store.entry.destroy({ path: model.value })

    model.value = null
}

function upload() {
    const input = document.createElement('input')

    input.type = 'file'

    input.onchange = async () => {
        if (!input.files || !input.files[0]) return

        const file = input.files[0]

        const compiled = template(props.column.filename || `${uuid()}.{ext}`, {
            interpolate: /{([\s\S]+?)}/g,
        })

        const filename = compiled({
            ext: DirectoryEntry.extname(file.path),
            itemPath: props.item._filename || '',
        })

        const path = DirectoryEntry.normalize(filename)

        const buffer = await file.arrayBuffer()

        await store.entry.write({
            path,
            data: new Uint8Array(buffer),
            contentType: 'Uint8Array',
        })

        if (filename !== model.value) {
            await deleteEntry().catch(Boolean)
        }

        model.value = path
    }

    input.click()
}
</script>

<template>
    <is-input v-if="column.type === 'number'" v-model="model" flat type="number" class="w-full" />

    <is-select
        v-else-if="column.type === 'select'"
        v-model="model"
        :options="select.options"
        flat
    />

    <v-dialog v-else-if="column.type === 'script'">
        <template #activator="{ attrs }">
            <is-input
                v-bind="attrs"
                :model-value="scriptLabel"
                readonly
                flat
                input:class="cursor-pointer w-full"
            />
        </template>

        <v-card width="500" height="500" color="b-secondary">
            <v-card-head>
                {{ $t('output') }}
            </v-card-head>

            <s-output :output="scriptOutput" />
        </v-card>
    </v-dialog>

    <is-select
        v-else-if="column.type === 'relation'"
        v-model="model"
        :label-key="column.displayField"
        :options="relation.items"
        return-object
        value-key="id"
        flat
    />

    <template v-else-if="column.type === 'entry'">
        <div class="px-4">
            <v-btn v-if="!model" color="info" size="sm" @click="upload">
                {{ $t('upload') }}
            </v-btn>

            <is-menu v-else offset-y close-on-content-click>
                <template #activator="{ on }">
                    <v-btn size="sm" v-bind="on" color="b-secondary" class="w-full !justify-start">
                        <e-entry-icon :model-value="model" class="mr-2" />

                        {{ DirectoryEntry.basename(model as string) }}
                    </v-btn>
                </template>
                <v-card color="b-secondary">
                    <is-list-item @click="upload">
                        {{ $t('upload') }}
                    </is-list-item>
                    <is-list-item @click="deleteEntry">
                        {{ $t('deleteEntity', [$t('entry')]) }}
                    </is-list-item>
                </v-card>
            </is-menu>
        </div>
    </template>

    <is-input v-else-if="typeof model === 'string'" v-model="model" flat />
</template>
