import { TokenType } from '@language-kit/lexer'
import { MarkdownNode, MarkdownNodeNodeType } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export class NodeWithId extends MarkdownNode {
    public id: string

    constructor(payload: Pick<MarkdownNode, 'tokens' | 'type'>, id?: string) {
        super()

        Object.assign(this, payload)

        this.id = id ?? uniqueId('node-')
    }

    public isBreakLine() {
        if (this.type !== MarkdownNodeNodeType.Paragraph) return

        if (this.tokens.length > 3) return

        return this.tokens.every((token) =>
            [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type as any)
        )
    }

    public isSetup() {
        if (!this.isComponent()) return

        return this.name === 'setup'
    }
}
