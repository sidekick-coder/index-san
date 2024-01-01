import ChronoStageItem from '../../entities/ChronoStageItem'
import IDrive from '../../gateways/IDrive'
import HelperService from '../../services/HelperService'
import IStageItemRepository from '../IStageItemRepository'

export default class LocalStageItemRepository implements IStageItemRepository {
    constructor(
        private readonly drive: IDrive,
        private readonly filename = '.chrono/tmp/stage'
    ) {}

    public save: IStageItemRepository['save'] = async (item) => {
        const all = await this.findAll()

        const search = all.find((i) => i.path === item.path)

        if (!search) {
            all.push(item)
        }

        if (search) {
            search.hash = item.hash
        }

        const content = all.map((i) => `${i.type} ${i.hash} ${i.path}`).join('\n')

        await this.drive.write(this.filename, HelperService.encode(content))
    }

    public findAll: IStageItemRepository['findAll'] = async () => {
        const bytes = await this.drive.read(this.filename)

        const items = [] as ChronoStageItem[]

        if (bytes) {
            const content = HelperService.decode(bytes)

            for (const line of content.split('\n')) {
                const [type, hash, path] = line.split(' ')

                items.push(
                    ChronoStageItem.from({
                        type,
                        hash,
                        path,
                    })
                )
            }
        }

        return items
    }
}
