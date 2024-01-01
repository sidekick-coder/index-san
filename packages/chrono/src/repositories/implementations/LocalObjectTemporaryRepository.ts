import IDrive from '../../gateways/IDrive'
import IHash from '../../gateways/IHash'
import LocalObjectRepository from './LocalObjectRepository'

export default class LocalObjectTemporaryRepository extends LocalObjectRepository {
    constructor(drive: IDrive, hash: IHash, directory = '.chrono/tmp/objects') {
        super(drive, hash, directory)
    }
}
