<script setup lang="ts">
import { useCase } from '../composables/use-case'
import { useDatabaseStore } from '../stories/database'
import { DatabaseTable } from '../types'
import { useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  filepath: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const database = useDatabaseStore()

const dialog = useVModel(props, 'modelValue', emit)
const loading = ref(false)

const table = ref<Omit<DatabaseTable, 'id'>>({
  name: 'My table',
  type: 'folder',
  columns: [],
  config: {},
})

async function create() {
  return useCase('create-database-table', {
    id: props.filepath,
    name: table.value.name,
    columns: table.value.columns,
  })
}

async function update() {
  return useCase('update-database-table', {
    id: props.filepath,
    data: {
      name: table.value.name,
      columns: table.value.columns,
    },
  })
}

async function submit() {
  loading.value = true

  const item = database.tables.find((t) => t.id === props.filepath)

  const promise = item ? update() : create()

  await promise
    .then(async () => {
      dialog.value = false

      await database.load()

      emit('submit')
    })
    .finally(() => setTimeout(() => (loading.value = false), 800))
}

async function load() {
  if (!dialog.value) return

  if (!database.tables.length) {
    await database.load()
  }

  const item = database.tables.find((t) => t.id === props.filepath)

  table.value.name = item ? item.name : 'New Table'
  table.value.columns = item ? item.columns : []
}

watch(dialog, load, { immediate: true })
</script>
<template>
  <w-dialog v-model="dialog">
    <w-form @submit="submit">
      <w-card class="p-5" width="[600px]">
        <div class="text-2xl mb-4 font-bold">Database table</div>
        <w-input :model-value="filepath" disabled label="Folder Name" class="mb-4" />
        <w-input v-model="table.name" label="Table Name" class="mb-4" />

        <div class="max-h-[300px] overflow-y-auto mb-4">
          <div v-if="table.columns.length" class="flex mb-4 font-bold text-sm">
            <div class="w-6/12">Name</div>
            <div class="w-5/12">Type</div>
          </div>

          <div v-for="(c, index) in table.columns" :key="index" class="flex gap-x-4 mb-4">
            <div class="w-6/12">
              <w-input v-model="c.name" />
            </div>
            <div class="w-5/12">
              <w-select
                v-model="c.type"
                :options="['string', 'integer', 'float', 'boolean', 'date']"
                class=""
              />
            </div>
            <div class="w-1/12 flex items-center">
              <button
                class="w-8 h-8 rounded-full hover:bg-gray-100 text-sm"
                type="button"
                @click="table.columns.splice(index, 1)"
              >
                <fa-icon icon="times" />
              </button>
            </div>
          </div>

          <button
            class="px-4 h-8 rounded-full hover:bg-gray-100 text-sm my-4"
            type="button"
            @click="table.columns.push({ name: '', type: '' })"
          >
            <fa-icon class="mr-2" icon="plus" />
            <span>Add column</span>
          </button>
        </div>

        <w-btn color="accent" :loading="loading" width="full">Submit</w-btn>
      </w-card>
    </w-form>
  </w-dialog>
</template>
