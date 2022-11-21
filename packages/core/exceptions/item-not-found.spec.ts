import { test } from '@japa/runner'
import ItemNotFound from './item-not-found'

test.group('item not found exception (unit)', () => {
    test('should have correct format', ({ expect }) => {
        const workspaceId = 'hello'
        const collectionId = 'word'
        const itemId = 'my-item'

        const error = new ItemNotFound(workspaceId, collectionId, itemId)

        expect(error.message).toBe('Item not found')
        expect(error.i18nKey).toBe('errors.itemNotFound')
        expect(error.i18nArgs).toEqual([workspaceId, collectionId, itemId])
    })
})
