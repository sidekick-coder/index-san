import ChronoObject from './ChronoObject'

export interface ChronoObjectTreeEntry {
    name: string
    hash: string
    type: 'blob' | 'tree'
}

export default class ChronoObjectTree extends ChronoObject {
    public get entries() {
        const lines = this.body.split('\n').filter(Boolean)

        return lines.map((line) => {
            const [type, hash, name] = line.split(' ')

            return {
                type,
                hash,
                name,
            }
        })
    }

    public serialize() {
        return {
            ...super.serialize(),
            entries: this.entries,
        }
    }

    public static fromEntries(entries: ChronoObjectTreeEntry[]) {
        let content = 'type: tree' + ChronoObject.HEAD_SEPARATOR

        entries.forEach((entry) => {
            content += `${entry.type} ${entry.hash} ${entry.name}\n`
        })

        return new ChronoObjectTree(content)
    }
}
