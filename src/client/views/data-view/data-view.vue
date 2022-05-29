<script setup lang="ts">
import { Item } from '@/types'
import { Builder } from 'vue-wind/types/composable/tailwind'

import { useCase } from '@/composables/use-case'
import { ref, onMounted } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const items = ref<any>([])

const columns = ref([
  {
    name: 'view',
    label: '',
    field: 'id',
  },
  {
    name: 'delete',
    label: '',
    field: 'id',
  },
])

const edit = ref(false)
const selected = ref(null)
const selectedColumn = ref<any>(null)

function load() {
  useCase('show-item-data-view', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
  })
    .then((data) => {
      items.value = data.items
      columns.value.unshift(...data.head)
    })
    .catch((err) => {
      console.error(err)
    })
}

function deleteItem(item: Item) {
  console.log('delete', item)
}

function editItem(item: Item) {
  console.log('edit', item)
}

onMounted(load)

function duplicate() {
  console.log(selected.value)
}

function modify(b: Builder) {
  b.child('td').remove('p-2').remove('border-b').static('p-0 h-[40px]')
  b.child('th').remove('p-2').static('px-4 h-[40px]')
}
</script>
<template>
  <w-data-table
    v-model:item="selected"
    v-model:column="selectedColumn"
    :columns="columns"
    :items="items"
    class="data-view"
    enable-navigation
    navigation-cell-selector=".cell"
    :modify="modify"
    @keydown.enter="edit = !edit"
  >
    <template #item-name="{ item: i }">
      <input :value="i.name" />
    </template>

    <template
      v-for="c in columns.filter((c) => !['delete', 'view'].includes(c.name))"
      :key="c.name"
      #[`item-${c.name}`]="{ item: i }"
    >
      <input
        class="cell px-4 bg-white h-full w-full outline-none focus:bg-accent/10 focus:border-accent border-[transparent] border border-b-gray-200"
        :value="i[c.field]"
        type="text"
      />
    </template>

    <template #item-view="{ item: i }">
      <i
        class="icon-action mr-4 cell"
        tabindex="0"
        @click.stop="editItem(i)"
        @keydown.enter="editItem(i)"
      >
        <fa-icon icon="eye" />
      </i>
    </template>

    <template #item-delete="{ item: i }">
      <i
        class="icon-action cell"
        tabindex="0"
        @click.stop="deleteItem(i)"
        @keydown.enter="deleteItem(i)"
      >
        <fa-icon icon="trash" />
      </i>
    </template>

    <!-- <template #item="{ item: i }">
      <td v-for="c in columns.filter((c) => c.name !== 'actions')" :key="c.name" class="p-0">
        <input
          class="bg-white p-2 w-full outline-none focus:bg-accent/10 focus:border-accent border-[transparent] border border-b-gray-200"
          :value="i[c.field]"
        />
      </td>

      <td class="border-b">
        <i class="icon-action mr-4" @click.stop="editItem(i)">
          <fa-icon icon="pen" />
        </i>
        <i class="icon-action" @click.stop="deleteItem(i)">
          <fa-icon icon="trash" />
        </i>
      </td>
    </template> -->
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

.data-view th:nth-last-of-type(-n + 2) {
  @apply w-[50px];
}
</style>
