import { MarkdownNode } from '@language-kit/markdown'

export class MarkdownNodeComponent extends MarkdownNode {
    public readonly type = 'component' 
    public name = 'unknown'
    public body = ''
    public attrs: Record<string, string> = {}
    public isInlined = false
}
