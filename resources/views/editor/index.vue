<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useEditor, EditorSaveContext } from './editor'
import { ref, onMounted, PropType } from 'vue'
import { File, ItemOption } from '@/types'
import { throttle } from 'lodash'

const api = useWindowApi()

const props = defineProps({
  file: {
    type: Object as PropType<File>,
    required: true,
  },
})

const editorRef = ref<HTMLElement>()
const saving = ref(false)
const displayTitle = ref('')

const saveTitle = throttle(async () => {
  const { path, workspace } = props.file

  await api
    .patch(`/options/${workspace.name}/${path}`, {
      displayTitle: displayTitle.value,
    })
    .catch(console.error)
}, 1000)

async function setTitle() {
  const { path, workspace } = props.file
  displayTitle.value = props.file.name

  await api
    .get<ItemOption>(`/options/${workspace.name}/${path}`)
    .then(({ data }) => {
      if (!data.displayTitle) return

      displayTitle.value = data.displayTitle
    })
    .catch(console.error)
}

async function save(data: EditorSaveContext) {
  saving.value = true

  await api
    .invoke('file:write', { path: props.file.systemPath, content: data.text })
    .catch(() => console.error('Failed to save file'))
    .finally(() => (saving.value = false))
}

async function setContent() {
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

async function load() {
  await setTitle()
  await setContent()
}

onMounted(load)
</script>
<template>
  <div class="pt-10 px-16">
    <h2 class="text-2xl mb-4">
      <input
        v-model="displayTitle"
        class="focus:border-0 outline-none font-bold"
        @change="saveTitle"
      />
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
