import ChronoObject from "../entities/ChronoObject"
import IDrive from "../gateways/IDrive"
import IHash from "../gateways/IHash"

export default class ObjectService {
    constructor(
        private readonly drive: IDrive,
        private readonly hashService: IHash
    ){}

    public async hashObject(object: ChronoObject) {
        return this.hashService.hash(object.toBytes())
    }

    public async writeObject(object: ChronoObject) {
        const hash = await this.hashObject(object)
        
        const path = this.drive.resolve('.chrono', 'objects', hash)
        
        const bytes = object.toBytes()

        await this.drive.write(path, bytes)

        return {
            hash,
            path
        }
    }
}