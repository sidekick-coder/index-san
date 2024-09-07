import { MarkdownNode } from '@language-kit/markdown'

export class MarkdownNodeLogicalComponent extends MarkdownNode {
    public readonly type = 'logical-component' 
    public name = 'unknown'
    public body = ''
    public attrs: Record<string, string> = {}
    public isInlined = false
}
