<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { useAttrs, defineAsyncComponent } from 'vue'

import { ColumnType } from '@index-san/core/entities/column'
import { createBindings } from '@composables/binding'

const IValueText = defineAsyncComponent(() => import('./IValueText.vue'))
const IValueNumber = defineAsyncComponent(() => import('./IValueNumber.vue'))
const IValueSelect = defineAsyncComponent(() => import('./IValueSelect.vue'))
const IValueDate = defineAsyncComponent(() => import('./IValueDate.vue'))
const IValueCheckbox = defineAsyncComponent(() => import('./IValueCheckbox.vue'))

const IValueRelation = defineAsyncComponent(() => import('./IValueRelation.vue'))
const IValueLink = defineAsyncComponent(() => import('./IValueLink.vue'))
const IValueScript = defineAsyncComponent(() => import('./IValueScript.vue'))
const IValueEntry = defineAsyncComponent(() => import('./IValueEntry.vue'))
const IValueTimestamp = defineAsyncComponent(() => import('./IValueTimestamp.vue'))

defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
    type: {
        type: String as () => ColumnType,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    edit: {
        type: Boolean,
        default: null,
    },
})

// bindings

const attrs = useAttrs()

const bindings = createBindings(attrs, ['input', 'select', 'checkbox'])
</script>

<template>
    <suspense>
        <template #fallback>
            <div
                class="text-t-secondary text-sm py-2"
                v-bind="bindings.root"
            >
                {{ $t('loading') }}
            </div>
        </template>

        <i-value-text
            v-if="type === ColumnType.text"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-number
            v-else-if="type === ColumnType.number"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-select
            v-else-if="type === ColumnType.select"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'select'])"
        />

        <i-value-script
            v-else-if="type === ColumnType.script"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-link
            v-else-if="type === ColumnType.link"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-relation
            v-else-if="type === ColumnType.relation"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'select'])"
        />

        <i-value-date
            v-else-if="type === ColumnType.date"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-entry
            v-else-if="type === ColumnType.entry"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <i-value-checkbox
            v-else-if="type === ColumnType.checkbox"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'checkbox'])"
        />

        <i-value-timestamp
            v-else-if="type === ColumnType.createdAt || type === ColumnType.updatedAt"
            :collection-id="collectionId"
            :item-id="itemId"
            :column-id="columnId"
            :edit="edit"
            v-bind="bindings.multiple(['root', 'input'])"
        />

        <div
            v-else
            :model-value="$t('errors.unknown')"
            class="text-danger px-4 py-2"
            readonly
            v-bind="bindings.multiple(['root', 'input'])"
        />
    </suspense>
</template>
