import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import DeleteCollection from './delete-collection'

test.group('delete-collection (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new DeleteCollection(app)

    group.tap((t) => t.teardown(() => app.memoryDrive.clear()))

    test('should delete a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.is/collections.json')

        app.memoryDrive.createFile(entry.path, [collection])

        const workspace = await app.workspaceRepository.create(
            WorkspaceFactory.create({
                drive: 'memory',
            })
        )

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        const content = app.memoryDrive.content.get('.is/collections.json')

        const json = content ? JSON.parse(content.toString()) : []

        expect(json.length).toEqual(0)
    })

    test('should trigger an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await app.workspaceRepository.create(
            WorkspaceFactory.create({
                drive: 'memory',
            })
        )

        await useCase
            .execute({
                workspaceId: workspace.id,
                collectionId: 'invalid',
            })
            .catch((err) => expect(err.message).toEqual('Collection not found'))
    })
})
