import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ListItems from './list-items'

test.group('list-items (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new ListItems(app)

    group.each.teardown(() => app.clear())

    test('should return a list of items', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()
        const collection = CollectionFactory.create()

        app.drive.createFile(DirectoryEntry.normalize('.is', 'collections.json'), [collection])

        for (let i = 0; i < 20; i++) {
            app.drive.mkdir(DirectoryEntry.normalize(collection.path, String(i)))
        }

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        expect(result.data.length).toEqual(20)
    })
})
