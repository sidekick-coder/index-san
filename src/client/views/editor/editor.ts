import EditorJS from '@editorjs/editorjs'
import { EditorPlugin, EditorPluginOptions } from '@/views/editor/composables/define-editor-plugin'
import { useObservers } from '@/composables/use-observers'

const plugins: EditorPlugin[] = Object.values(import.meta.globEager('./plugins/*.ts')).map(
  (m) => m.default
)

export function useEditor(element: HTMLElement) {
  const tools: EditorPluginOptions['tools'] = new Map()
  const events = useObservers()

  events.register('ready')
  events.register('change')

  plugins.forEach((p) => p({ tools, events }))

  const editor = new EditorJS({
    holder: element,
    tools: Object.fromEntries(tools),
    onChange: () => {
      editor.save().then((data) => events.notify('change', data))
    },
  })

  editor.isReady.then(() => events.notify('ready', editor))

  return {
    events,
    editor,
  }
}
