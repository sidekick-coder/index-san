import { useCase } from '@/composables/use-case'
import { Item } from '@/types'

export default (item: Item) => {
  function testLine(line: string) {
    return line.startsWith('![')
  }

  function testBlock(block: EditorJS.OutputBlockData) {
    return block.type === 'image'
  }

  async function toBlock(line: string) {
    const [alt, url] = line.replace(/!\[(.*?)\]\((.*?)\)/gim, '$1 $2').split(' ')

    const block: EditorJS.OutputBlockData = {
      type: 'image',
      data: {
        alt,
        url,
        src: url,
      },
    }

    const buffer = await useCase<ArrayBuffer | null>('show-item-file', {
      workspaceId: item.workspaceId,
      path: url,
    })

    if (!buffer) return block

    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )

    block.data.src = `data:;base64,${base64}`

    return block
  }

  async function toLine(block: EditorJS.OutputBlockData) {
    console.log(block)
    return `![${block.data.alt}](${block.data.url})`
  }

  return { testLine, toBlock, testBlock, toLine }
}
