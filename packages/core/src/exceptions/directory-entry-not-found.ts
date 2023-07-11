import BaseException from './base'

export default class DirectoryEntryNotFound extends BaseException {
    constructor(path: string) {
        super('DirectoryEntry not found')

        this.i18nKey = 'errors.directoryEntryNotFound'

        this.i18nArgs = [path]
    }
}
