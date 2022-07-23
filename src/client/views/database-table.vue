<script setup lang="ts">
import { DatabaseTable, Item } from '../types'
import { Builder } from 'vue-wind/types/composable/tailwind'

import { useCase } from '../composables/use-case'
import { ref, onMounted, computed } from 'vue'
import { throttle } from 'lodash'
import { useDatabaseStore } from '../stories/database'

interface Column {
  name: string
  field: string
  label: string
  style?: string
}

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const database = useDatabaseStore()

const table = computed<DatabaseTable | undefined>(() =>
  database.tables.find((table) => table.id === props.item.id)
)

const items = ref<any[]>([])

const columns = computed<Column[]>(() => {
  if (!table.value) {
    return [{ name: 'name', field: 'name', label: 'Name' }]
  }

  return table.value.columns.map((column) => ({
    name: column.name,
    field: column.name,
    label: column.name,
  }))
})

async function load() {
  if (!database.tables.length) {
    await database.load()
  }

  useCase('list-table-rows', {
    tableId: table.value?.id,
  }).then((response) => {
    items.value = response
  })
}

const update = throttle(async (item: Item, key: string, value: string) => {
  return await useCase('save-item-metadata', {
    workspaceId: item.workspaceId,
    itemId: item.id,
    data: {
      [key]: value,
    },
  })
    .then(console.log)
    .catch(console.error)
}, 1000)

onMounted(load)

function modify(b: Builder) {
  b.child('td').remove('p-2').remove('border-b').static('p-0 h-[40px]')
  b.child('th').remove('p-2').static('px-4 h-[40px]')
}
</script>
<template>
  <w-data-table
    :columns="columns"
    :items="items"
    class="data-view"
    enable-navigation
    navigation-cell-selector=".cell"
    :modify="modify"
  >
    <template #item-name="{ item: i }">
      <input :value="i.name" />
    </template>

    <template v-for="c in columns" :key="c.name" #[`item-${c.name}`]="{ item: i }">
      <input
        :value="i[c.field]"
        class="cell px-4"
        type="text"
        @change="e => update(i, c.field,(e.target as any).value)"
        @keydown.right.stop=""
        @keydown.left.stop=""
      />
    </template>

    <template #item-open="{ item: i }">
      <router-link :to="`/${i.workspaceId}/${i.id}`" class="cell flex items-center justify-center">
        <fa-icon icon="eye" />
      </router-link>
    </template>
  </w-data-table>
</template>

<style>
.data-view .icon-action {
  @apply inline-flex items-center justify-center;
  @apply text-xs h-full w-full;
  @apply cursor-pointer;
}
.data-view .cell {
  @apply h-full w-full;
  @apply outline-none;
  @apply hover:bg-accent/10;
  @apply transition-colors;
  @apply focus:bg-accent/10 focus:border-accent border-[transparent] border border-b-gray-200;
}
</style>
