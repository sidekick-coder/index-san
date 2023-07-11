import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import CollectionFactory from '../../__tests__/factories/collections'
import ViewFactory from '../../__tests__/factories/view'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateViews from './update-views'

test.group('update-views (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new UpdateViews(app)

    group.each.teardown(() => app.clear())

    function createCollection() {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.is/collections.json')

        app.drive.createFile(entry.path, [collection])

        return collection
    }

    test('should update views', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        const collection = createCollection()

        const entry = DirectoryEntry.file(collection.path, '.is', 'views.json')

        app.drive.createFile(entry.path, ViewFactory.createMany(5))

        const data = ViewFactory.createMany(5)

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data,
        })

        const content = await app.drive.readArray(entry.path)

        expect(content).toEqual(data)
    })
})
