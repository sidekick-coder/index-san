import { test } from '@japa/runner'

import CreateItem from './create-item'
import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'

test.group('create-item (use-case)', (group) => {
    const app = new InMemoryAppConfig()

    const useCase = new CreateItem(app)

    group.each.teardown(() => app.clear())

    test('should create an item in collection', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()
        const collection = CollectionFactory.create()

        app.drive.createFile('.is/collections.json', [collection])

        const { data } = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {},
        })

        expect(app.drive.entries[1].path).toEqual([collection.path, data.id].join('/'))
    })
})
