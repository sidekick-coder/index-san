import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import HelperService from '../services/HelperService'

export default class InitUseCase {
    constructor(private readonly drive: IDrive) {}

    public async execute() {
        const alreadyInitialized = await this.drive.exists('.chrono')

        if (alreadyInitialized) {
            throw new BaseException('Chrono already initialized')
        }

        await this.drive.mkdir('.chrono')
        await this.drive.mkdir('.chrono/objects')
        await this.drive.mkdir('.chrono/blobs')
        await this.drive.mkdir('.chrono/stage')

        await this.drive.write('.chrono/head', HelperService.encode(''))
        await this.drive.write('.chrono/index', HelperService.encode('[]'))
    }
}
