import BaseException from "../exceptions/BaseException";
import IDrive from "../gateways/IDrive";

export default class InitUseCase {

    constructor(private readonly drive: IDrive){}

    public async execute(){

        const alreadyInitialized = await this.drive.exists('.chrono')

        if (alreadyInitialized) {
            throw new BaseException('Chrono already initialized')
        }

        const folders = [
            '.chrono',
            '.chrono/objects',
            '.chrono/blobs'
        ]

        for (const folder of folders) {
            await this.drive.mkdir(folder)
        }
    }
}