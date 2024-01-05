import ChronoObjectTree from '../../entities/ChronoObjectTree'
import HeadEntry from '../../entities/HeadEntry'
import IDrive from '../../gateways/IDrive'
import HelperService from '../../services/HelperService'
import IHeadEntryRepository from '../IHeadEntryRepository'
import IObjectRepository from '../IObjectRepository'

export default class LocalHeadEntryRepository implements IHeadEntryRepository {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository
    ) {}

    public async findEntriesFromTree(treeHash: string, basePath = '') {
        const entries = [] as HeadEntry[]

        const object = await this.objectRepository.findOrFail(treeHash)

        const tree = new ChronoObjectTree(object.content)

        for await (const e of tree.entries) {
            const headEntry = HeadEntry.from({
                path: `${basePath}${e.path}`,
                hash: e.hash,
                type: e.type,
            })

            entries.push(headEntry)

            if (e.type === 'tree') {
                const childEntries = await this.findEntriesFromTree(e.hash, `${headEntry.path}/`)

                entries.push(...childEntries)
            }
        }

        return entries
    }

    public findAll: IHeadEntryRepository['findAll'] = async () => {
        const contents = await this.drive.read('.chrono/head')

        const hash = HelperService.decode(contents)

        if (!hash) {
            return []
        }

        const object = await this.objectRepository.findOrFail(hash)

        if (object.type === 'commit') {
            return this.findEntriesFromTree(object.head.tree)
        }

        return []
    }
}
