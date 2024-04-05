import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import { IndexEntryStatus } from '../entities/IndexEntry'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import HashEntryService from '../services/HashEntryService'
import HelperService from '../services/HelperService'
import TreeService from '../services/TreeService'

export default class StatusUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly entryRepository: IIndexEntryRepository
    ) {}

    public async findLastCommit() {
        const headContents = await this.drive.read('.chrono/head')
        const headHash = HelperService.decode(headContents)

        if (!headHash) {
            return null
        }

        const object = await this.objectRepository.findOrFail(headHash)

        if (object.type !== 'commit') {
            throw new Error('Not a commit object')
        }

        return new ChronoObjectCommit(object.content, object.hash)
    }

    public async execute() {
        const hashService = new HashEntryService(this.drive, this.objectRepository, this.blobRepository)
        const treeService = new TreeService(this.objectRepository)

        const allFiles = await this.drive.readdir('/', {
            recursive: true,
            onlyFiles: true,
        })

        const filteredFiles = allFiles.filter((f) => !f.includes('.chrono'))

        const entries = await this.entryRepository.findAll()

        const untracked = filteredFiles.filter((f) => !entries.some((e) => e.path === f))

        const added = entries
            .filter((e) => [IndexEntryStatus.Added, IndexEntryStatus.Modified].includes(e.status))
            .map((e) => e.path)

        const changed = [] as string[]

        for await (const entry of entries) {
            const { objectHash } = await hashService.hashEntry(entry.path)

            if (objectHash !== entry.hash && entry.status === IndexEntryStatus.Unmodified) {
                changed.push(entry.path)
            }
        }

        const deleted = [] as string[]
        const lastCommit = await this.findLastCommit()

        if (lastCommit) {
            const entries = await treeService.findTreeIndex(lastCommit.tree)

            entries
                .filter((e) => e.type === 'blob')
                .forEach((entry) => {
                    if (!allFiles.includes(entry.fullPath)) {
                        deleted.push(entry.fullPath)
                    }
                })
        }

        return {
            untracked,
            changed,
            added,
            deleted
        }
    }
}
