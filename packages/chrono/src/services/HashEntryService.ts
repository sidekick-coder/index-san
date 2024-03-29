import ChronoObject from '../entities/ChronoObject'
import ChronoObjectTree, { ChronoObjectTreeEntry } from '../entities/ChronoObjectTree'
import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'

export default class HashEntryService {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository
    ) {}

    public async hashFile(path: string) {
        const content = await this.drive.read(path)

        if (!content) {
            throw new BaseException('File can not be read')
        }

        const { blobHash } = await this.blobRepository.save(content)

        const blobObject = ChronoObject.fromObject({
            type: 'blob',
            blobHash,
        })

        return await this.objectRepository.save(blobObject)
    }

    public async hashDirectory(path: string) {
        const entries = await this.drive.readdir(path)

        const treeEntries = [] as ChronoObjectTreeEntry[]

        for await (const entry of entries) {
            const entryPath = this.drive.resolve(path, entry)

            const isFile = await this.drive.isFile(entryPath)

            const result = await this.hashEntry(entryPath)

            treeEntries.push({
                path: entry,
                hash: result.objectHash,
                type: isFile ? 'blob' : 'tree',
            })
        }

        const tree = ChronoObjectTree.fromEntries(treeEntries)

        return this.objectRepository.save(tree)
    }

    public async hashEntry(path: string) {
        if (!(await this.drive.exists(path))) {
            throw new BaseException('File not found')
        }

        if (await this.drive.isFile(path)) {
            return this.hashFile(path)
        }

        return this.hashDirectory(path)
    }
}
