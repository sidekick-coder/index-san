export interface EditorParserOptions {
  testText: (text: string) => boolean
  testBlock: (block: EditorJS.OutputBlockData) => boolean
  toText: (block: EditorJS.OutputBlockData, systemPath: string) => string
  toBlock: (line: string, systemPath: string) => EditorJS.OutputBlockData
}

export function defineEditorParser(opt: EditorParserOptions) {
  return opt
}
