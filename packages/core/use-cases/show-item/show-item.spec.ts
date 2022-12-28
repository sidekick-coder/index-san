import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import Item from '../../entities/item'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import ShowItem from './show-item'

test.group('show-item (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new ShowItem(app)

    group.each.teardown(() => app.clear())

    test('should return item by id', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()
        const collection = CollectionFactory.create({ crudName: 'memory' })

        app.drive.createFile('.is/collections.json', [collection])

        const item = new Item({
            name: 'test',
        })

        app.drive.createFile(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'), [item])
        app.drive.createDir(DirectoryEntry.normalize(collection.path, item.id))

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
        })

        expect(result.data.id).toEqual(item.id)
        expect(result.data.name).toEqual(item.name)
    })
})
