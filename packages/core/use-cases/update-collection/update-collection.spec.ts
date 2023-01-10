import { test } from '@japa/runner'

import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateCollection from './update-collection'

test.group('update-collection (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new UpdateCollection(app)

    group.each.teardown(() => app.clear())

    test('should update a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        app.drive.createFile('.is/collections.json', JSON.stringify([collection]))

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {
                name: 'update-name',
            },
        })

        const content = await app.drive.readArray('.is/collections.json')

        expect(content[0].name).toEqual('update-name')
    })

    test('should trigger an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.createFake()

        await useCase
            .execute({
                workspaceId: workspace.id,
                collectionId: 'invalid',
                data: {},
            })
            .catch((err) => expect(err.message).toEqual('Collection not found'))
    })
})
