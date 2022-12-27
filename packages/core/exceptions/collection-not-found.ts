import BaseException from './base'

export default class CollectionNotFound extends BaseException {
    constructor(collectionId: string) {
        super('Collection not found')

        this.i18nKey = 'errors.collectionNotFound'

        this.i18nArgs = [collectionId]
    }
}
