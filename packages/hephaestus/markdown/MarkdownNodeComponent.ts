import { MarkdownNode, MarkdownNodeType } from '@language-kit/markdown'

export class MarkdownNodeComponent extends MarkdownNode {
    public readonly type = MarkdownNodeType.Component
    public name = 'unknown'
    public body = ''
    public attrs: Record<string, string> = {}
    public isInlined = false
}
