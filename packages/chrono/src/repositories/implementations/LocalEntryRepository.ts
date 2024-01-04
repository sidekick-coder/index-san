import ChronoEntry from '../../entities/ChronoEntry'
import IDrive from '../../gateways/IDrive'
import IHash from '../../gateways/IHash'
import HelperService from '../../services/HelperService'
import IEntryRepository from '../IEntryRepository'

export default class LocalEntryRepository implements IEntryRepository {
    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash
    ) {}

    public findAll: IEntryRepository['findAll'] = async () => {
        const contents = await this.drive.read('.chrono/index')

        const json = JSON.parse(contents ? HelperService.decode(contents) : '[]')

        return json.map((i: any) => new ChronoEntry(i.path, i.hash, i.status))
    }

    public saveAll: IEntryRepository['saveAll'] = async (entries) => {
        await this.drive.write(
            '.chrono/index',
            HelperService.encode(JSON.stringify(entries, null, 4))
        )
    }
}
