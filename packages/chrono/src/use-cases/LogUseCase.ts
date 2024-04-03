import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import IObjectRepository from '../repositories/IObjectRepository'
import TreeService from '../services/TreeService'

export interface LogUseCaseParams {
    path?: string
}

export default class LogUseCase {
    constructor(private readonly objectRepository: IObjectRepository) {}

    public async execute(options?: LogUseCaseParams) {
        const service = new TreeService(this.objectRepository)

        const objects = await this.objectRepository.findAll()

        const commits = objects
            .filter((object) => object.type === 'commit')
            .map((o) => new ChronoObjectCommit(o.content, o.hash))
            .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (!options?.path) {
            return commits
                .map((o) => o.serialize())
                .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }

        const fileCommits = []
        let lastHash = ''

        for await (const commit of commits) {
            const entries = await service.findTreeIndex(commit.tree)

            const fileEntry = entries.find((e) => e.fullPath === options.path)

            if (fileEntry && fileEntry.hash !== lastHash) {
                fileCommits.push(commit)
                lastHash = fileEntry.hash
            }
        }

        return fileCommits
    }
}
