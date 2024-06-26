import IDrive from '../../gateways/IDrive'
import IHash from '../../gateways/IHash'
import IBlobRepository from '../IBlobRepository'

export default class LocalBlobRepository implements IBlobRepository {
    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash,
        private readonly directory = '.chrono/blobs'
    ) {}

    public save: IBlobRepository['save'] = async (content) => {
        const blobHash = await this.hash.hash(content)

        const startHash = blobHash.slice(0, 2)
        const endHash = blobHash.slice(2)

        const folderPath = this.drive.resolve(this.directory, startHash)
        const filePath = this.drive.resolve(folderPath, endHash)

        if (await this.drive.exists(filePath)) {
            return { blobHash }
        }

        if (!(await this.drive.exists(folderPath))) {
            await this.drive.mkdir(folderPath)
        }

        await this.drive.write(filePath, content)

        return { blobHash }
    }

    public find: IBlobRepository['find'] = async (blobHash) => {
        const startHash = blobHash.slice(0, 2)
        const endHash = blobHash.slice(2)

        const folderPath = this.drive.resolve(this.directory, startHash)
        const filePath = this.drive.resolve(folderPath, endHash)

        if (!(await this.drive.exists(filePath))) {
            return null
        }

        const bytes = await this.drive.read(filePath)

        if (!bytes) {
            return null
        }

        return bytes
    }

    public findOrFail: IBlobRepository['findOrFail'] = async (blobHash) => {
        const bytes = await this.find(blobHash)

        if (!bytes) {
            throw new Error(`Blob ${blobHash} not found`)
        }

        return bytes
    }

    public copyFrom: IBlobRepository['copyFrom'] = async (repository, blobHash) => {
        const bytes = await repository.findOrFail(blobHash)

        await this.save(bytes)
    }
}
