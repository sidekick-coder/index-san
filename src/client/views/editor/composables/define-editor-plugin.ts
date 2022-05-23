import { useObservers } from '@/composables/use-observers'

export interface EditorPluginOptions {
  tools: Map<string, EditorJS.ToolConstructable | EditorJS.ToolSettings>
  events: ReturnType<typeof useObservers>
}

export interface EditorPlugin {
  (options: EditorPluginOptions): void
}

export function defineEditorPlugin(cb: (opt: EditorPluginOptions) => void) {
  return cb
}
