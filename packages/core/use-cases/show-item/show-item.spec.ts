import { test } from '@japa/runner'
import Item from '../../entities/item'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import ShowItem from './show-item'

test.group('show-item (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new ShowItem(app)

    const workspace = WorkspaceFactory.create()
    const collection = CollectionFactory.create()

    group.each.setup(() => {
        app.memoryDrive.createFile('.is/collections.json', JSON.stringify([collection]))
        app.workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => app.clear())

    test('should return item by id', async ({ expect }) => {
        const item = new Item({})

        app.memoryDrive.mkdir(`${collection.path}/${item.id}`)

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
        })

        expect(result.data).toEqual({
            id: item.id,
            workspaceId: workspace.id,
            collectionId: collection.id,
        })
    })
})
