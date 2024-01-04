import IDrive from '../gateways/IDrive'
import IEntryRepository from '../repositories/IEntryRepository'

interface Params {
    path: string
}

export default class RemoveUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly entryRepository: IEntryRepository
    ) {}

    public async removeEntry(path: string) {
        const entries = await this.entryRepository.findAll()

        const index = entries.findIndex((entry) => entry.path === path)

        if (index === -1) return

        entries.splice(index, 1)

        await this.entryRepository.saveAll(entries)
    }

    async execute({ path }: Params) {
        if (await this.drive.isFile(path)) {
            await this.removeEntry(path)

            return
        }

        const files = await this.drive.readdir(path, {
            recursive: true,
            onlyFiles: true,
        })

        for await (const file of files) {
            await this.removeEntry(`${path}/${file}`)
        }
    }
}
