import ChronoObjectTree from '../entities/ChronoObjectTree'
import ChronoStageItem from '../entities/ChronoStageItem'
import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import IStageItemRepository from '../repositories/IStageItemRepository'
import HashFileUseCase from './HashFileUseCase'

interface Params {
    path: string
}

export default class AddStateItemUseCase {
    private hashFileUseCase: HashFileUseCase

    constructor(
        private readonly drive: IDrive,
        private readonly stageItemRepository: IStageItemRepository,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository
    ) {
        this.hashFileUseCase = new HashFileUseCase(drive, objectRepository, blobRepository)
    }

    public async findAllTreeStageItem(rootPath: string) {
        const items = [] as ChronoStageItem[]

        const { objectHash: rootHash } = await this.hashFileUseCase.execute({ path: rootPath })

        const chronoObject = await this.objectRepository.find(rootHash)

        if (!chronoObject || chronoObject.type !== 'tree') {
            throw new BaseException()
        }

        const tree = new ChronoObjectTree(chronoObject.content)

        items.push(ChronoStageItem.from({ type: 'tree', hash: rootHash, path: rootPath }))

        for (const entry of tree.entries) {
            const entryPath = `${rootPath}/${entry.name}`

            if (entry.type === 'blob') {
                const { objectHash } = await this.hashFileUseCase.execute({ path: entryPath })

                items.push(
                    ChronoStageItem.from({ type: 'blob', hash: objectHash, path: entryPath })
                )
            }

            if (entry.type === 'tree') {
                const subItems = await this.findAllTreeStageItem(entryPath)

                items.push(...subItems)
            }
        }

        return items
    }

    async execute({ path }: Params) {
        const { objectHash } = await this.hashFileUseCase.execute({ path })

        const chronoObject = await this.objectRepository.find(objectHash)

        if (!chronoObject) {
            throw new BaseException()
        }

        if (chronoObject.type === 'blob') {
            const item = ChronoStageItem.from({
                type: 'blob',
                hash: objectHash,
                path,
            })

            await this.stageItemRepository.save(item)

            return item
        }

        if (chronoObject.type === 'tree') {
            const items = await this.findAllTreeStageItem(path)

            for (const item of items) {
                await this.stageItemRepository.save(item)
            }

            return items
        }
    }
}
