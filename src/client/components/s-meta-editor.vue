<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item } from '@/types'
import { throttle } from 'lodash'
import { ref, watch } from 'vue'
import YAML from 'yaml'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const metas = ref('')

function load() {
  const item = props.item
  metas.value = YAML.stringify(
    {
      displayName: item.metas?.displayName ?? item.name,
      relations: item.metas?.relations ?? [],
      ...item.metas,
    },
    null,
    2
  )
}

watch(() => props.item.path, load, { immediate: true })

const update = throttle(async () => {
  return await useCase('save-item-metadata', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
    data: YAML.parse(metas.value),
  })
    .then(console.log)
    .catch(console.error)
}, 1000)
</script>
<template>
  <div>
    <w-textarea v-model="metas" class="h-[500px]" @change="update" />
  </div>
</template>
