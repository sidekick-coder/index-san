<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item } from '@/types'
import { throttle } from 'lodash'
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const content = ref('')

async function load() {
  await useCase('show-item', {
    id: props.item.id,
    responseType: 'buffer',
  }).then((data) => {
    content.value = new TextDecoder().decode(data)
  })
}

load()

const update = throttle(
  () =>
    useCase('update-item', {
      id: props.item.id,
      content: content.value,
    }),
  1000
)

watch(content, update)
</script>
<template>
  <textarea
    v-model="content"
    class="flex h-full w-full items-center justify-center overflow-y-auto outline-none px-8 py-5 bg-slate-50"
  >
  </textarea>
</template>
