import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import IObjectRepository from '../repositories/IObjectRepository'

export default class LogUseCase {
    constructor(private readonly objectRepository: IObjectRepository) {}

    public async execute() {
        const objects = await this.objectRepository.findAll()

        const commits = objects
            .filter((object) => object.type === 'commit')
            .map((o) => new ChronoObjectCommit(o.content, o.hash))

        return commits
            .map((o) => o.serialize())
            .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
}
