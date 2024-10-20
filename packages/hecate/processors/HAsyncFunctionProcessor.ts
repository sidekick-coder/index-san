import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HAsyncFunction from '../nodes/HAsyncFunction'

export default class HAsyncFunctionProcessor extends BaseProcessor<HNode> {
    public order = 1

    public findEnd() {
        const start = this.tokens.findIndex((t) => t.value === '{')
        let open = 0

        const index =  this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            if (t.value === '{') {
                open++
                return
            }

            if (open > 0 && t.value === '}') {
                open--
                return
            }

            if (open === 0 && t.value === '}') {
                return true
            }

            return false
        })

        return index
    }

    public findName() {
        const fnKeywordIndex = this.tokens.findIndex((t) => t.value === 'function')

        const token = this.tokens.find((t, i) => {
            if (i <= fnKeywordIndex) return false

            return t.type === 'Word'
        })

        return token?.value || ''
    }

    public findBodyStartToken() {
        return this.tokens.find((t) => t.value === '{')
    }

    public findBody() {
        const start = this.tokens.findIndex((t) => t.value === '{')
        const end = this.findEnd()

        return this.tokens.slice(start + 1, end)
    }

    public isFunction(){
        return this.tokens.slice(0, 3).toText().trim() === 'async function'
    }

    public isExportFunction(){
        return this.tokens.slice(0, 5).toText().trim() === 'export async function'
    }

    public process() {

        if (!this.isFunction() && !this.isExportFunction()) {
            return false
        }

        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HAsyncFunction()

        node.tokens = tokens
        node.name = this.findName()
        node.export = this.isExportFunction()
        node.body = this.findBody().toText().trim()
        node.children = this.parser.toNodes(this.findBody().toText(), {
            lexer: {
                includeEndOfFileToken: false
            }
        })

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}

