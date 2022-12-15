import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import ViewFactory from '../../__tests__/factories/view'
import ShowViews from './show-views'

test.group('show-views (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new ShowViews(app)

    group.each.teardown(() => app.clear())

    function createCollection() {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.is/collections.json')

        app.memoryDrive.createFile(entry.path, [collection])

        return collection
    }

    test('should return list of views', async ({ expect }) => {
        const views = ViewFactory.createMany(5)

        const workspace = app.workspaceRepository.createFakeSync()

        const collection = createCollection()

        const entry = DirectoryEntry.file(collection.path, '.is', 'views.json')

        app.memoryDrive.createFile(entry.path, views)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        expect(result.data).toEqual(views)
    })
})
