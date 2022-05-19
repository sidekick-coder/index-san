import { defineEditorParser } from '../composables/define-editor-parser'

export default defineEditorParser({
  testText: (text) => typeof text === 'string',
  testBlock: (block) => block.type === 'paragraph',
  toText: (block) => {
    return block.data.text || ''
  },
  toBlock: (line) => {
    return {
      type: 'paragraph',
      data: {
        text: line,
      },
    }
  },
})
