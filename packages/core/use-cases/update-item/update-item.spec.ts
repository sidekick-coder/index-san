import { test } from '@japa/runner'

import Item from '../../entities/item'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import UpdateItem from './update-item'

test.group('update-item (use-case)', (group) => {
    const app = new InMemoryApp()
    const useCase = new UpdateItem(app)

    group.each.teardown(() => app.memoryDrive.clear())

    test('should update an item in collection', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()
        const collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', JSON.stringify([collection]))

        const item = await app.memoryCrud.create(
            collection.path,
            new Item({
                name: 'test',
                custom: 'hello word',
            })
        )

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
            data: {
                custom: 'update hello',
            },
        })

        const updated = await app.memoryCrud.findById(collection.path, item.id)

        expect(updated?.custom).toEqual('update hello')
    })
})
