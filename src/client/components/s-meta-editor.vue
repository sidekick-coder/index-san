<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item, MetaRelation } from '@/types'
import { throttle } from 'lodash'
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const itemMetas = ref({
  displayName: '',
  relations: [] as MetaRelation[],
})

function load() {
  if (props.item.metas?.displayName) {
    itemMetas.value.displayName = props.item.metas.displayName
  }

  if (props.item.metas?.relations) {
    itemMetas.value.relations = props.item.metas.relations
  }
}

watch(props.item, load, { immediate: true })

const update = throttle(async () => {
  await useCase('save-item-metadata', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
    data: itemMetas.value,
  })
    .then(console.log)
    .catch(console.error)
}, 1000)
</script>
<template>
  <div class="py-4">
    <div class="mb-4 px-4">
      <w-input v-model="itemMetas.displayName" label="Display Name" @change="update" />
    </div>
    <hr class="mb-4" />
    <div class="px-4">
      <w-input
        v-for="relation in itemMetas.relations"
        :key="relation.name"
        v-model="relation.value"
        :label="`${relation.name} (${relation.type})`"
        @change="update"
      />
    </div>
  </div>
</template>
