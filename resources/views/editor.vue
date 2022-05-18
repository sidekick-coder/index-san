<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useEditor } from '@/composables/use-editor'
import { Item } from '@/stores/workspace'
import { ref, onMounted, PropType } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
})

const api = useWindowApi()
const editorRef = ref<HTMLElement>()
const saving = ref(false)

async function save(data: any) {
  saving.value = true

  // await api
  //   .invoke('file:write', { path: props.path, content: data })
  //   .catch(() => console.error('Failed to save file'))
  //   .finally(() => (saving.value = false))
}

async function load() {
  await api
    .invoke('file:read', {
      workspace: props.item.workspace.name,
      path: props.path,
    })
    .catch(() => alert('Failed to load file'))
    .then(async (raw) => {
      if (!editorRef.value) {
        alert('Failed to load editor')
        return
      }

      const editor = useEditor(editorRef.value, raw)

      await editor.start()

      editor.onchange(save)
    })
}

onMounted(load)
</script>
<template>
  <div class="pt-10 px-16">
    <h2 class="text-2xl mb-4">
      <input :value="item.name" readonly class="focus:border-0 outline-none font-bold" />
    </h2>
    <div ref="editorRef" class="w-full"></div>
  </div>
</template>

<style>
.ce-block__content,
.ce-toolbar__content {
  max-width: unset;
}
</style>
