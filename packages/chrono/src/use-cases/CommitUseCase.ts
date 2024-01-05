import IndexEntry, { IndexEntryStatus } from '../entities/IndexEntry'
import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import ChronoObjectTree from '../entities/ChronoObjectTree'
import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import HelperService from '../services/HelperService'
import HashFileUseCase from './HashEntryUseCase'

interface Params {
    message: string
    body?: string
}

export default class CommitUseCase {
    public hashFileUseCase: HashFileUseCase

    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly entryRepository: IIndexEntryRepository
    ) {}

    public findAllDirectories(entries: IndexEntry[]) {
        const result = [] as string[]

        for (const entry of entries) {
            const parts = entry.path.split('/')

            for (let i = 0; i < parts.length - 1; i++) {
                const path = parts.slice(0, i + 1).join('/')

                if (!result.includes(path)) {
                    result.push(path)
                }
            }
        }

        return result
    }

    public findFilesInDirectory(entries: IndexEntry[], directory: string) {
        return entries
            .map((entry) => entry.path)
            .filter((path) => {
                const parts = path.split('/')
                const parent = parts.slice(0, parts.length - 1).join('/')

                return parent === directory
            })
    }

    public findDirectoriesInDirectory(entries: IndexEntry[], directory: string) {
        return this.findAllDirectories(entries).filter((d) => {
            const parts = d.split('/')
            const parent = parts.slice(0, parts.length - 1).join('/')

            return parent === directory
        })
    }

    public async findTreeEntries(entries: IndexEntry[], directory: string) {
        const filesEntries = entries.filter((e) => {
            const parts = e.path.split('/')
            const parent = parts.slice(0, parts.length - 1).join('/')

            return parent === directory
        })

        const directories = this.findDirectoriesInDirectory(entries, directory)

        const result = [] as ChronoObjectTree['entries']

        for (const fileEntry of filesEntries) {
            result.push({
                path: fileEntry.path,
                hash: fileEntry.hash,
                type: 'blob',
            })
        }

        for await (const directory of directories) {
            const treeEntries = await this.findTreeEntries(entries, directory)
            const tree = ChronoObjectTree.fromEntries(treeEntries)
            const { objectHash } = await this.objectRepository.save(tree)

            result.push({
                path: directory,
                hash: objectHash,
                type: 'tree',
            })
        }

        return result
    }

    async execute({ message }: Params) {
        if (!message) {
            throw new BaseException('Commit message is required')
        }

        // get stage
        const entries = await this.entryRepository.findAll()

        // const entriesAdded = entries.filter((item) => item.status === IndexEntryStatus.Added)

        const rootEntries = entries
            .filter((item) => !item.path.includes('/'))
            .map((i) => ({
                path: i.path,
                hash: i.hash,
                type: 'blob',
            }))

        const directories = this.findAllDirectories(entries)

        for await (const directory of directories) {
            const treeEntries = await this.findTreeEntries(entries, directory)

            const tree = ChronoObjectTree.fromEntries(treeEntries)

            const { objectHash } = await this.objectRepository.save(tree)

            if (!directory.includes('/')) {
                rootEntries.push({
                    path: directory,
                    hash: objectHash,
                    type: 'tree',
                })
            }
        }

        const rootTree = ChronoObjectTree.fromEntries(rootEntries)

        const { objectHash: rooTreeHash } = await this.objectRepository.save(rootTree)

        const commit = ChronoObjectCommit.from({
            message,
            tree: rooTreeHash,
        })

        const { objectHash: commitHash } = await this.objectRepository.save(commit)

        await this.drive.write('.chrono/HEAD', HelperService.encode(commitHash))

        entries
            .filter((item) => item.status === IndexEntryStatus.Added)
            .forEach((item) => {
                item.status = IndexEntryStatus.Unmodified
            })

        await this.entryRepository.saveAll(entries)

        return {
            commitHash,
            commit: commit.serialize(),
        }
    }
}
