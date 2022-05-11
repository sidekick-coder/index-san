<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useEditor } from '@/composables/use-editor'
import { ref, onMounted } from 'vue'

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
})

const api = useWindowApi()
const editorRef = ref<HTMLElement>()
const saving = ref(false)

async function save(data: any) {
  saving.value = true

  await api
    .invoke('file:write', { path: props.path, content: data })
    .catch(() => console.error('Failed to save file'))
    .finally(() => (saving.value = false))
}

async function load() {
  if (!editorRef.value) {
    alert('Failed to load editor')
    return
  }

  const raw = await api.invoke('file:read', { path: props.path })

  const editor = useEditor(editorRef.value, raw)

  await editor.start()

  editor.onchange(save)
}

onMounted(load)
</script>
<template>
  <div ref="editorRef" class="w-full"></div>
</template>

<style>
.ce-block__content,
.ce-toolbar__content {
  max-width: unset;
}
</style>
