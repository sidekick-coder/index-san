import { test } from '@japa/runner'
import Item from '../../entities/item'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'

import DeleteItem from './delete-item'

test.group('delete-item (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new DeleteItem(app)

    const workspace = WorkspaceFactory.create({ driveName: 'memory' })
    const collection = CollectionFactory.create({ crudName: 'memory' })

    group.each.setup(() => {
        app.memoryDrive.createFile('.is/collections.json', [collection])
        app.workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => app.clear())

    test('should delete an item in collection', async ({ expect }) => {
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
        })

        expect(app.memoryDrive.entries.length).toEqual(1)
        expect(app.memoryCrud.metas.length).toEqual(0)
    })
})
