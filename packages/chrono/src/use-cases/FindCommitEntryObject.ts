import ChronoObjectBlob from '../entities/ChronoObjectBlob'
import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import IObjectRepository from '../repositories/IObjectRepository'
import TreeService from '../services/TreeService'

export interface LogUseCaseParams {
    path: string
    commitHash: string
}

export default class FindCommitEntryObject {
    constructor(private readonly objectRepository: IObjectRepository) {}

    public async execute({ path, commitHash }: LogUseCaseParams) {
        const service = new TreeService(this.objectRepository)

        const object = await this.objectRepository.findOrFail(commitHash)

        if (object.type !== 'commit') {
            throw new Error('Not a commit object')
        }

        const commit = new ChronoObjectCommit(object.content, object.hash)
        
        const entries = await service.findTreeIndex(commit.tree)

        const fileEntry = entries.find((e) => e.fullPath === path)

        if (!fileEntry) {
            throw new Error('File not found in commit')
        }

        const entryObject = await this.objectRepository.findOrFail(fileEntry.hash)

        return new ChronoObjectBlob(entryObject.content, entryObject.hash)        
    }
}
