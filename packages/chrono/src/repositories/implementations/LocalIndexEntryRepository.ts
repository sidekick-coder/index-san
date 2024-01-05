import IndexEntry from '../../entities/IndexEntry'
import IDrive from '../../gateways/IDrive'
import HelperService from '../../services/HelperService'
import IIndexEntryRepository from '../IIndexEntryRepository'

export default class LocalIndexEntryRepository implements IIndexEntryRepository {
    constructor(private readonly drive: IDrive) {}

    public findAll: IIndexEntryRepository['findAll'] = async () => {
        const contents = await this.drive.read('.chrono/index')

        const json = JSON.parse(contents ? HelperService.decode(contents) : '[]')

        const entries = json.map((i: any) => new IndexEntry(i.path, i.hash, i.status))

        return entries
    }

    public saveAll: IIndexEntryRepository['saveAll'] = async (entries) => {
        await this.drive.write(
            '.chrono/index',
            HelperService.encode(JSON.stringify(entries, null, 4))
        )
    }
}
