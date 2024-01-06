import ChronoObjectTree from '../entities/ChronoObjectTree'
import IObjectRepository from '../repositories/IObjectRepository'

interface TreeEntry {
    path: string
    fullPath: string
    hash: string
    type: string
}

export default class TreeService {
    constructor(private readonly objectRepository: IObjectRepository) {}

    private async findEntriesFromTree(treeHash: string, basePath = '') {
        const entries = [] as TreeEntry[]

        const object = await this.objectRepository.findOrFail(treeHash)

        const tree = new ChronoObjectTree(object.content)

        for await (const e of tree.entries) {
            const entry: TreeEntry = {
                path: e.path,
                fullPath: `${basePath}${e.path}`,
                hash: e.hash,
                type: e.type,
            }

            entries.push(entry)

            if (e.type === 'tree') {
                const childEntries = await this.findEntriesFromTree(e.hash, `${entry.path}/`)

                entries.push(...childEntries)
            }
        }

        return entries
    }

    public async findTreeIndex(hash: string) {
        return this.findEntriesFromTree(hash)
    }
}
