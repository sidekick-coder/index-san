import EditorJS from '@editorjs/editorjs'
import DragDrop from 'editorjs-drag-drop'

import { defineEditorPlugin } from '@/views/editor/composables/define-editor-plugin'

export default defineEditorPlugin(({ events }) => {
  events.subscribe('ready', (editor: EditorJS) => new DragDrop(editor))
})
