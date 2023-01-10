import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import Item from '../../entities/item'
import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'

import DeleteItem from './delete-item'

test.group('delete-item (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new DeleteItem(app)

    group.each.teardown(() => app.clear())

    test('should delete an item in collection', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()
        const collection = CollectionFactory.create({ crudName: 'memory' })

        app.drive.createFile('.is/collections.json', [collection])

        const item = new Item({
            name: 'test',
            custom: 'hello word',
        })

        app.drive.createFile(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'), [item])
        app.drive.createDir(DirectoryEntry.normalize(collection.path, item.id))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
        })

        const itemExists = await app.drive.exists(
            DirectoryEntry.normalize(collection.path, item.id)
        )

        const metas = await app.drive.readArray(
            DirectoryEntry.normalize(collection.path, '.is', 'metas.json')
        )

        expect(itemExists).toEqual(false)
        expect(metas.length).toEqual(0)
    })
})
