<script setup lang="ts">
import { Item } from '@/types'
import { Builder } from 'vue-wind/types/composable/tailwind'

import { useCase } from '@/composables/use-case'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface ColumnAction {
  name: 'open-path'
  icon: string
  label: string
}

interface Column {
  name: string
  field: string
  label: string
  style?: string
  action?: ColumnAction
}

interface UseStateResult {
  items: any[]
  columns: Column[]
}

const router = useRouter()

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const items = ref<any[]>([])
const columns = ref<Column[]>([])

const columnsComputed = computed<Column[]>(() => {
  const actions = columns.value.filter((column) => column.action)
  const normal = columns.value.filter((column) => !column.action)
  const data = items.value[0]

  if (normal.length || !data) return columns.value

  const keys = Object.keys(data).map((key) => ({
    name: key,
    field: key,
    label: key,
  }))

  return keys.concat(actions)
})

function load() {
  useCase<UseStateResult>('show-item-data-view', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
  })
    .then((data) => {
      items.value = data.items
      columns.value = data.columns.map((c) => ({
        ...c,
        style: c.action ? 'width:50px;' : '',
      }))
    })
    .catch(console.error)
}

async function handleAction(action: ColumnAction, data: any) {
  const actions = {
    'open-path': () => router.push(`/${data.workspaceId}/${data.path}`),
  }

  const method = actions[action.name]

  if (!method) {
    console.error(`Unknown action: ${action}`)
    return
  }

  method().catch(console.error)
}

onMounted(load)

function modify(b: Builder) {
  b.child('td').remove('p-2').remove('border-b').static('p-0 h-[40px]')
  b.child('th').remove('p-2').static('px-4 h-[40px]')
}
</script>
<template>
  <w-data-table
    :columns="columnsComputed"
    :items="items"
    class="data-view"
    enable-navigation
    navigation-cell-selector=".cell"
    :modify="modify"
  >
    <template #item-name="{ item: i }">
      <input :value="i.name" />
    </template>

    <template v-for="c in columnsComputed" :key="c.name" #[`item-${c.name}`]="{ item: i }">
      <i
        v-if="c.action"
        class="icon-action mr-4 cell"
        tabindex="0"
        @click.stop="handleAction(c.action!, i)"
        @keydown.enter="handleAction(c.action!, i)"
      >
        <fa-icon :icon="c.action.icon" />
      </i>

      <input
        v-else
        :value="i[c.field]"
        class="cell px-4 bg-white h-full w-full outline-none focus:bg-accent/10 focus:border-accent border-[transparent] border border-b-gray-200"
        type="text"
      />
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
