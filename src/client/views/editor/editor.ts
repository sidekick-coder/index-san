import EditorJS from '@editorjs/editorjs'
import { EditorPlugin, EditorPluginOptions } from '@/views/editor/composables/define-editor-plugin'
import { useObservers } from '@/composables/use-observers'
import { EditorParserOptions } from './composables/define-editor-parser'

export interface EditorSaveContext {
  data: EditorJS.OutputData
  text: string
}

const plugins: EditorPlugin[] = Object.values(import.meta.globEager('./plugins/*.ts')).map(
  (m) => m.default
)

const parsers: EditorParserOptions[] = Object.values(import.meta.globEager('./parsers/*.ts')).map(
  (m) => m.default
)

export function useEditor(element: HTMLElement, systemPath: string) {
  const tools: EditorPluginOptions['tools'] = new Map()
  const events = useObservers()

  events.register('ready')
  events.register('change')

  plugins.forEach((p) => p({ tools, events, systemPath }))

  async function onChange() {
    const data = await editor.save()

    const parsed = data.blocks.map((block) => {
      const parser = parsers.find((parser) => parser.testBlock(block))

      if (parser) {
        return parser.toText(block, systemPath)
      }

      return ''
    })

    const text = parsed.join('\n')

    const ctx: EditorSaveContext = {
      data,
      text,
    }

    events.notify('change', ctx)
  }

  function setContentByText(text: string) {
    const lines = text.split('\n')

    const blocks = lines.map((line) => {
      const parser = parsers.find((parser) => parser.testText(line))

      if (!parser) {
        return {
          type: 'paragraph',
          data: {
            text: line,
          },
        }
      }

      return parser.toBlock(line, systemPath)
    })

    editor.blocks.render({
      blocks,
    })
  }

  const editor = new EditorJS({
    holder: element,
    onChange,
    tools: Object.fromEntries(tools),
  })

  editor.isReady.then(() => events.notify('ready', editor))

  return {
    setContentByText,
    events,
    editor,
  }
}
