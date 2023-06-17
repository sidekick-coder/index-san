import { TokenArray, TokenType } from '@language-kit/lexer'
import { MarkdownNode, MarkdownNodeNodeType } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export class NodeWithId<T extends MarkdownNode = MarkdownNode> {
    public id: string
    public node: T

    constructor(payload: T, id?: string) {
        this.node = payload

        this.id = id ?? uniqueId('node-')
    }

    public get type() {
        return this.node.type
    }

    public get tokens(): TokenArray {
        return this.node.tokens
    }

    public toHtml(): string {
        return this.node.toHtml()
    }

    public toText(): string {
        return this.node.toText()
    }

    public isComponent() {
        return this.node.is(MarkdownNode.types.Component)
    }

    public isBreakLine() {
        if (this.type !== MarkdownNodeNodeType.Paragraph) return

        if (this.tokens.length > 3) return

        return this.tokens.every((token) =>
            [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type as any)
        )
    }

    public isSetup() {
        if (!this.node.is(MarkdownNode.types.Component)) return

        return this.node.name === 'setup'
    }
}
