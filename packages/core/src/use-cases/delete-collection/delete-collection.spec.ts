import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import DeleteCollection from './delete-collection'

test.group('delete-collection (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new DeleteCollection(app)

    group.each.teardown(() => app.clear())

    test('should delete a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.is/collections.json')

        app.drive.createFile(entry.path, [collection])

        const workspace = await app.workspaceRepository.createFake()

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        const content = await app.drive.readArray('.is/collections.json')

        expect(content.length).toEqual(0)
    })

    test('should trigger an error if collection was not found', async ({ expect }) => {
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
