import { Token, TokenArray } from '@language-kit/lexer'
import { MarkdownNodeComponent } from './MarkdownNodeComponent'
import { MarkdownProcessor } from '@language-kit/markdown'
import { MarkdownNodeLogicalComponent } from './MarkdownNodeLogicalComponent'

export class MarkdownProcessorLogicalComponent extends MarkdownProcessor {
    public order = 9 

    public findEndComponentWithBreakLineIndex() {
            }

    public findInlineEndComponentIndex() {
        return this.tokens.findIndex((t, i) => {
            if (i <= 2) return false

            const prev = this.tokens[i - 1]

            if (!prev) return false

            return [prev.value, t.value].every((value) => value === ':')
        })
    }

    public findEndComponentIndex() {
		return this.tokens.findIndex((_t, i) => {
            if (i <= 2) return false

            const prev = this.tokens[i - 1]
            const prevPrev = this.tokens[i - 2]

            if (!prev || !prevPrev) return false

            return [prev.value, prevPrev.value].every((value) => value === ':')
        })
    }

    public findNameTokens() {
        const lineEndIndex = this.findEndLineIndex()

        if (lineEndIndex === -1) {
            return new TokenArray()
        }

        let endIndex = this.findIndexByValue('{', 2, lineEndIndex)

        if (endIndex === -1) {
            endIndex = lineEndIndex
        }

        return this.tokens.slice(3, endIndex)
    }

    public findAttrsTokens() {
        const lineEndIndex = this.findEndLineIndex()

        if (lineEndIndex === -1) return new TokenArray()

        const startIndex = this.findIndexByValue('{', 2, lineEndIndex)

        if (startIndex === -1) return new TokenArray()

        const endIndex = this.findIndexByValue('}', startIndex)

        if (endIndex === -1) return new TokenArray()

        return this.tokens.slice(startIndex, endIndex + 1)
    }

    public findAttrsObject(): MarkdownNodeComponent['attrs'] {
        const tokens = this.findAttrsTokens()

        return this.transformStringToAttrsObject(tokens.toText())
    }

	public findEndBodyIndex(){
		return this.tokens.findIndex((t, i) => {
			const prev = this.tokens[i - 1]

			return prev?.value === ':' && t.value == ':'

		})
	}

    public findBodyTokens() {
        const nameTokens = this.findNameTokens()
        const attrsTokens = this.findAttrsTokens()

        const endComponentIndex = this.findEndComponentIndex()

        if (endComponentIndex === -1) {
            return new TokenArray()
        }

        let startBodyIndex = 3

        startBodyIndex += nameTokens.length
        startBodyIndex += attrsTokens.length

        const endBodyIndex = this.findEndComponentIndex() - 2

        return this.tokens.slice(startBodyIndex, endBodyIndex)
    }

    public process() {

		if (this.tokens.slice(0, 3).toText() !== '::!') return false

        const endLineIndex = this.findEndComponentIndex()

        if (endLineIndex === -1) return false

        const tokens = this.tokens.slice(0, endLineIndex + 1)

        const node = new MarkdownNodeLogicalComponent()

        node.tokens = tokens

        node.body = this.findBodyTokens().toText().trim()
        node.name = this.findNameTokens().toText().trim()
        node.attrs = this.findAttrsObject()

        this.nodes.push(node)

        this.tokens.splice(0, tokens.length)

        return true
    }
}
