import BaseException from './base'

export default class ItemNotFound extends BaseException {
    constructor(workspaceId: string, collectionId: string, itemId: string) {
        super('Item not found')

        this.i18nKey = 'errors.itemNotFound'

        this.i18nArgs = [workspaceId, collectionId, itemId]
    }
}
