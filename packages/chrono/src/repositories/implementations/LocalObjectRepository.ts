import ChronoObject from '../../entities/ChronoObject'
import IDrive from '../../gateways/IDrive'
import IHash from '../../gateways/IHash'
import IObjectRepository from '../IObjectRepository'

export default class LocalObjectRepository implements IObjectRepository {
    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash,
        private readonly directory = '.chrono/objects'
    ) {}

    public save: IObjectRepository['save'] = async (chronoObject) => {
        const objectHash = await this.hash.hash(chronoObject.toBytes())

        const startHash = objectHash.slice(0, 2)
        const endHash = objectHash.slice(2)

        const folderPath = this.drive.resolve(this.directory, startHash)
        const filePath = this.drive.resolve(folderPath, endHash)

        if (!(await this.drive.exists(folderPath))) {
            await this.drive.mkdir(folderPath)
        }

        await this.drive.write(filePath, chronoObject.toBytes())

        chronoObject.hash = objectHash

        return {
            objectHash,
        }
    }

    public findAll: IObjectRepository['findAll'] = async () => {
        const files = await this.drive.readdir(this.directory, {
            recursive: true,
            onlyFiles: true,
        })

        const result: ChronoObject[] = []

        for await (const file of files) {
            result.push(await this.findOrFail(file.replace('/', '')))
        }

        return result
    }

    public find: IObjectRepository['find'] = async (objectHash) => {
        const startHash = objectHash.slice(0, 2)
        const endHash = objectHash.slice(2)

        const folderPath = this.drive.resolve(this.directory, startHash)

        if (!(await this.drive.exists(folderPath))) {
            return null
        }

        const files = await this.drive.readdir(folderPath)

        const search = files.find((file) => file.startsWith(endHash))

        if (!search) {
            return null
        }

        const filePath = this.drive.resolve(folderPath, search)

        if (!(await this.drive.exists(filePath))) {
            return null
        }

        const bytes = await this.drive.read(filePath)

        if (!bytes) {
            return null
        }

        const chronoObject = new ChronoObject(bytes, objectHash)

        return chronoObject
    }

    public findOrFail: IObjectRepository['findOrFail'] = async (objectHash) => {
        const chronoObject = await this.find(objectHash)

        if (!chronoObject) {
            throw new Error(`Object ${objectHash} not found`)
        }

        return chronoObject
    }

    public copyFrom: IObjectRepository['copyFrom'] = async (repository, objectHash) => {
        const chronoObject = await repository.findOrFail(objectHash)

        await this.save(chronoObject)
    }
}
