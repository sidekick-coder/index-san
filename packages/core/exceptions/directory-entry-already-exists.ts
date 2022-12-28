import BaseException from './base'

export default class DirectoryEntryAlreadyExists extends BaseException {
    constructor(path: string) {
        super('DirectoryEntry already exists')

        this.i18nKey = 'errors.directoryEntryAlreadyExists'

        this.i18nArgs = [path]
    }
}
