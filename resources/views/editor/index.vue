<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useEditor, EditorSaveContext } from './editor'
import { ref, onMounted, PropType } from 'vue'
import { File } from '@/types'

const api = useWindowApi()

const props = defineProps({
  file: {
    type: Object as PropType<File>,
    required: true,
  },
})

const editorRef = ref<HTMLElement>()
const saving = ref(false)

async function save(data: EditorSaveContext) {
  saving.value = true

  await api
    .invoke('file:write', { path: props.file.systemPath, content: data.text })
    .catch(() => console.error('Failed to save file'))
    .finally(() => (saving.value = false))
}

async function load() {
  if (!editorRef.value) {
    alert('Failed to load file')
    return
  }
  const { events, setContentByText } = useEditor(editorRef.value, props.file.item.systemPath)

  const content = await api.invoke('file:read', { path: props.file.systemPath })

  events.subscribe('ready', () => {
    setContentByText(content)
  })

  events.subscribe('change', save)
}

onMounted(load)
</script>
<template>
  <div class="pt-10 px-16">
    <h2 class="text-2xl mb-4">
      <input :value="file.name" readonly class="focus:border-0 outline-none font-bold" />
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
