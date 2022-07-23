<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item } from '@/types'
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const src = ref()

async function setImage() {
  await useCase<ArrayBuffer>('show-item', {
    id: props.item.id,
    responseType: 'buffer',
  })
    .then((data) => {
      const base64 = btoa(
        new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      src.value = `data:${props.item.type};base64,${base64}`
    })
    .catch(console.error)
}

setImage()
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card color="white" class="drop-shadow-md mx-auto max-h-full max-w-full">
      <img v-if="src" :src="src" class="w-full object-cover" />
    </w-card>
  </div>
</template>
