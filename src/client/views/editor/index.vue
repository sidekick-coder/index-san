<script setup lang="ts">
import { useEditor } from './editor'
import { parseText, parseBlocks } from './main-parser'
import { ref, onMounted } from 'vue'
import { Item } from '@/types'
import { throttle } from 'lodash'
import { useCase } from '@/composables/use-case'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const editorRef = ref<HTMLElement>()
const saving = ref(false)
const displayName = ref('')

const saveTitle = throttle(async () => {
  // const { path, workspace } = props.file
  // await api
  //   .patch(`/options/${workspace.name}/${path}`, {
  //     displayName: displayName.value,
  //   })
  //   .catch(console.error)
  //   .then(console.log)
}, 1000)

function setTitle() {
  displayName.value = props.item.config.displayName || props.item.name
  // const { path, workspace } = props.file
  // await api
  //   .get<ItemOption>(`/options/${workspace.name}/${path}`)
  //   .then(({ data }) => {
  //     console.log(data, path)
  //     if (!data.displayName) return
  //     displayName.value = data.displayName
  //   })
  //   .catch(() => (displayName.value = props.file.name))
}

async function save(data: EditorJS.OutputData) {
  const text = await parseBlocks(props.item, data.blocks)

  await useCase('update-item-file', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
    content: text,
  })
    .catch(console.error)
    .finally(() => (saving.value = false))
}

async function setContent() {
  if (!editorRef.value) {
    alert('Failed to load file')
    return
  }

  const { events, editor } = useEditor(editorRef.value)

  events.subscribe('change', save)

  const buffer = await useCase<ArrayBuffer | null>('show-item-file', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
  })

  if (!buffer) return

  const decoder = new TextDecoder('utf-8')

  const text = decoder.decode(buffer)

  events.subscribe('ready', async () => {
    const blocks = await parseText(props.item, text)

    editor.blocks.render({ blocks })
  })
}

async function load() {
  displayName.value = props.item.config.displayName || props.item.name

  await setContent()
}

onMounted(load)
</script>
<template>
  <div class="pt-10 px-16">
    <h2 class="text-2xl mb-4">
      <input
        v-model="displayName"
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
