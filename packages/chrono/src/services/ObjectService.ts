import ChronoObject from '../entities/ChronoObject'
import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import IHash from '../gateways/IHash'

export default class ObjectService {
    constructor(
        private readonly drive: IDrive,
        private readonly hashService: IHash
    ) {}

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
            path,
        }
    }

    public async hashAndSaveFile(path: string) {
        // read file
        const fileBytes = await this.drive.read(path)

        if (!fileBytes) throw new BaseException('File not found')

        // create blob from file content
        const blobHash = await this.hashService.hash(fileBytes)
        const startHash = blobHash.slice(0, 2)
        const endHash = blobHash.slice(2)

        const folderPath = this.drive.resolve('.chrono', 'blobs', startHash)
        const filePath = this.drive.resolve(folderPath, endHash)

        if (!(await this.drive.exists(folderPath))) {
            await this.drive.mkdir(folderPath)
        }

        // save blob to .chrono/blobs
        await this.drive.write(filePath, fileBytes)

        // create object with link to blob
        const object = new ChronoObject({
            type: 'blob',
            blobHash,
        })

        await this.writeObject(object)

        return object
    }
}
