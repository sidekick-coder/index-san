import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HImport from '../nodes/HImport'
import HImportInline from '../nodes/HImportInline'

export default class HImportInlineProcessor extends BaseProcessor<HNode> {

    public order = 1

    public findEnd() {
        return this.tokens.findIndex((t) => t.value === ')')
    }
    
    public findFrom() {
        const start = this.tokens.findIndex((t) => t.value === '"' || t.value === "'")

        const end = this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            return t.value === '"' || t.value === "'";
        })

        return this.tokens.slice(start + 1, end).map((t) => t.value).join('')
    }

    public findProperties(){
        const start = this.tokens.findIndex((t) => t.value === '{')
        const end = this.tokens.findIndex((t) => t.value === '}')

        const properties = [] as HImport['properties']

        this.tokens.slice(start + 1, end)
            .filter(t => t.type === 'Word')
            .forEach((t) => {
                properties.push({
                    name: t.value
                })
            })

        return properties
    }

    public isImport(){
        const [current, next] = this.tokens

        if (current.value !== 'import') return false

        return current.value === 'import' && next.value === '('
    }

    public process() {
        if (!this.isImport()) return false

        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HImportInline()

        node.tokens = tokens
        node.from = this.findFrom()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}

