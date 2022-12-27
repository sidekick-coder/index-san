import { test } from '@japa/runner'
import CollectionNotFound from './collection-not-found'

test.group('workspace not found exception (unit)', () => {
    test('should have correct format', ({ expect }) => {
        const collectionId = 'word'

        const error = new CollectionNotFound(collectionId)

        expect(error.message).toBe('Collection not found')
        expect(error.i18nKey).toBe('errors.collectionNotFound')
        expect(error.i18nArgs).toEqual([collectionId])
    })
})
