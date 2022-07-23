<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  parentFilepath: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = useVModel(props, 'modelValue', emit)
const item = ref({
  type: 'file',
  filepath: 'new-file.txt',
})

async function submit() {
  await useCase('create-item', {
    type: item.value.type,
    filepath: `${props.parentFilepath}/${item.value.filepath}`,
  }).then(() => {
    item.value.filepath = 'new-file.txt'
    item.value.type = 'file'

    dialog.value = false
    emit('submit')
  })
}
</script>
<template>
  <w-dialog v-model="dialog">
    <w-form @submit="submit">
      <w-card class="p-5" width="[500px]">
        <div class="text-2xl mb-4 font-bold">New item</div>
        <w-input v-model="item.filepath" label="Name" class="mb-4" />
        <w-select v-model="item.type" label="Type" :options="['file', 'folder']" class="mb-4" />
        <w-btn>Submit</w-btn>
      </w-card>
    </w-form>
  </w-dialog>
</template>
