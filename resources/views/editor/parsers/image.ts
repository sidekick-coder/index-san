import { useWindowApi } from '@/composables/api'
import { defineEditorParser } from '../composables/define-editor-parser'

const { filesystem } = useWindowApi()

export default defineEditorParser({
  testText: (text) => text.startsWith('!['),
  testBlock: (block) => block.type === 'image',
  toText: (block) => {
    if (!block.data.src) return ''

    const src = filesystem.basename(block.data.src)

    return `![](./${src})`
  },
  toBlock: (line, systemPath) => {
    const src = line.match(/\((.*?)\)/)

    const fullPath = filesystem.systemResolve(systemPath, src ? src[1] : '')

    return {
      type: 'image',
      data: {
        src: `asset:${fullPath}`,
      },
    }
  },
})
