import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import HelperService from '../services/HelperService'

export default class ChronoObject {
    public static readonly HEAD_SEPARATOR = '\n\0\n'

    public content = ''

    public get headText() {
        const [head] = this.content.split(ChronoObject.HEAD_SEPARATOR)

        return head
    }

    public get head() {
        const text = this.headText

        const properties = text
            .split('\n')
            .filter(Boolean)
            .map((l) => l.split(': '))
            .map(([key, value]) => [camelCase(key), value])

        return Object.fromEntries(properties) as Record<string, string>
    }

    public get body() {
        const [, body] = this.content.split(ChronoObject.HEAD_SEPARATOR)

        return body
    }

    public get type() {
        return this.head.type
    }

    constructor(content: string | Uint8Array) {
        if (typeof content === 'string') {
            this.content = content
        }

        if (content instanceof Uint8Array) {
            this.content = HelperService.decode(content)
        }
    }

    public static from(object: Record<string, any>) {
        let content = ''

        Object.entries(object).forEach(([key, value]) => {
            content += `${snakeCase(key)}: ${value}\n`
        })

        content += ChronoObject.HEAD_SEPARATOR

        return new ChronoObject(content)
    }

    public toBytes() {
        return HelperService.encode(this.content)
    }

    public serialize() {
        return JSON.parse(
            JSON.stringify({
                type: this.type,
                head: this.head,
                body: this.body,
            })
        )
    }
}
