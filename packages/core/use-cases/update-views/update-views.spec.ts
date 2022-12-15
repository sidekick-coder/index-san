import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import ViewFactory from '../../__tests__/factories/view'
import UpdateViews from './update-views'

test.group('update-views (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new UpdateViews(app)

    group.each.teardown(() => app.clear())

    function createCollection() {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.is/collections.json')

        app.memoryDrive.createFile(entry.path, [collection])

        return collection
    }

    test('should update views', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        const collection = createCollection()

        const entry = DirectoryEntry.file(collection.path, '.is', 'views.json')

        app.memoryDrive.createFile(entry.path, ViewFactory.createMany(5))

        const data = ViewFactory.createMany(5)

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data,
        })

        const content = await app.memoryDrive.readArray(entry.path)

        expect(content).toEqual(data)
    })
})
