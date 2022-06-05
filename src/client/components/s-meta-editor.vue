<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item, MetaRelation } from '@/types'
import { throttle } from 'lodash'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const metas = ref('')

function load() {
  const item = props.item
  metas.value = JSON.stringify(
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
    data: JSON.parse(metas.value),
  })
    .then(console.log)
    .catch(console.error)
}, 1000)
</script>
<template>
  <div class="py-4">
    <w-textarea v-model="metas" class="h-[500px]" @change="update" />
  </div>
</template>
