import { CollectionColumn, CollectionColumnType } from '@/../core/entities/collection'
import { lib as script } from './script'

export function mount(columns: CollectionColumn[], name = 'ItemPayload') {
    const uri = 'ts:runtime/item.d.ts'

    const libs = script.mount()

    const source: string[] = []

    const types: Record<CollectionColumnType, string> = {
        entry: 'string | null',
        number: 'number',
        relation: 'null | any',
        script: 'undefined',
        select: 'string',
        text: 'string',
    }

    columns.forEach((c) => {
        const type = types[c.type] || 'any'

        source.push(`    ${c.field}: ${type}`)
    })

    source.unshift(`interface ${name} extends import('core/entities/item') { `)

    source.push('}')

    source.push(`declare const item: ${name}`)

    libs.push({ uri, source: source.join('\n') })

    return libs
}

export const lib = {
    mount,
}
