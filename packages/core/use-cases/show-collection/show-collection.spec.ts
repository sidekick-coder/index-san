import { test } from '@japa/runner'

import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import ShowCollection from './show-collection'

test.group('show-collection (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new ShowCollection(app)

    group.tap((t) => t.teardown(() => app.memoryDrive.clear()))

    test('should return a collection by id', async ({ expect }) => {
        const collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', [collection])

        const workspace = await app.workspaceRepository.createFake()

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        expect(result.data).toEqual({
            ...collection,
            workspaceId: workspace.id,
        })
    })

    test('should trigger an error if is an invalid collection', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()

        await useCase
            .execute({
                workspaceId: workspace.id,
                collectionId: 'invalid',
            })
            .catch((err) => expect(err.message).toEqual('Collection not found'))
    })
})
