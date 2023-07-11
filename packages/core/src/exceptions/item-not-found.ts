import BaseException from './base'

export default class ItemNotFound extends BaseException {
    constructor(collectionId: string, itemId: string) {
        super('Item not found')

        this.i18nKey = 'errors.itemNotFound'

        this.i18nArgs = [collectionId, itemId]
    }
}
