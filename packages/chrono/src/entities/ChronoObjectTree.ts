import ChronoObject from './ChronoObject'

export interface ChronoObjectTreeEntry {
    path: string
    hash: string
    type: string
}

export default class ChronoObjectTree extends ChronoObject {
    public get entries() {
        const lines = this.body.split('\n').filter(Boolean)

        return lines.map((line) => {
            const [type, hash, path] = line.split(' ')

            return {
                type,
                hash,
                path,
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
            content += `${entry.type} ${entry.hash} ${entry.path}\n`
        })

        return new ChronoObjectTree(content)
    }
}
