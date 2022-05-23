import { Item } from '@/types'

interface LineParserConstructor {
  (item: Item): LineParser
}

interface LineParser {
  testLine(line: string): boolean
  toBlock(line: string): Promise<EditorJS.OutputBlockData>
  testBlock(block: EditorJS.OutputBlockData): boolean
  toLine(block: EditorJS.OutputBlockData): Promise<string>
}

const allParsers: LineParserConstructor[] = Object.values(
  import.meta.globEager('./line-parsers/*.ts')
)
  .map((p) => p.default)
  .filter((p) => typeof p === 'function')

export async function parseText(item: Item, text: string) {
  const lines = text.split('\n')
  const lineParsers = allParsers.map((p) => p(item))

  const blocks: EditorJS.OutputBlockData[] = []

  for (const line of lines) {
    const parser = lineParsers.find((p) => p.testLine(line))

    if (parser) {
      blocks.push(await parser.toBlock(line))
      continue
    }

    blocks.push({
      type: 'paragraph',
      data: {
        text: line,
      },
    })
  }

  return blocks
}

export async function parseBlocks(item: Item, blocks: EditorJS.OutputBlockData[]) {
  const lineParsers = allParsers.map((p) => p(item))

  const lines: string[] = []

  for (const block of blocks) {
    const parser = lineParsers.find((p) => p.testBlock(block))

    if (parser) {
      lines.push(await parser.toLine(block))
      continue
    }

    lines.push(block.data.text)
  }

  return lines.join('\n')
}
