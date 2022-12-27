import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import ListItems from './list-items'

test.group('list-items (use-case)', (group) => {
    const app = new InMemoryApp()

    const useCase = new ListItems(app)

    const workspace = WorkspaceFactory.create({ driveName: 'memory' })
    const collection = CollectionFactory.create({ crudName: 'memory' })

    group.each.setup(() => {
        app.memoryDrive.write('.is/collections.json', Buffer.from(JSON.stringify([collection])))
        app.workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => app.clear())

    test('should return a list of items', async ({ expect }) => {
        for (let i = 0; i < 20; i++) {
            app.memoryDrive.mkdir(`${collection.path}/${i}`)
        }

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        expect(result.data.length).toEqual(20)
    })
})
