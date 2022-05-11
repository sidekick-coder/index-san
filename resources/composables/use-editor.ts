import EditorJS from '@editorjs/editorjs'
import DragDrop from 'editorjs-drag-drop'

export function toBlocks(raw: string) {
  const blocks = raw.split('\n').map((line) => ({
    type: 'paragraph',
    data: { text: line },
  }))

  return blocks
}

export function useEditor(element: HTMLElement, raw = '') {
  let editor: EditorJS
  let callback: (raw: string) => void

  async function start() {
    editor = new EditorJS({
      holder: element,
      onChange: async () => {
        if (!callback) return

        const raw = await getRaw()
        callback(raw)
      },
    })

    await editor.isReady

    new DragDrop(editor)

    editor.blocks.render({
      blocks: toBlocks(raw),
    })
  }

  async function getRaw() {
    const data = await editor.save()

    return data.blocks.map((block) => block.data.text).join('\n')
  }

  function onchange(cb: (raw: string) => void) {
    callback = cb
  }

  return {
    start,
    getRaw,
    onchange,
  }
}
