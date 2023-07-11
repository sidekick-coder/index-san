import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'

import Item from '../../entities/item'
import CollectionFactory from '../../__tests__/factories/collections'
import InMemoryAppConfig from '../../__tests__/in-memory-config'
import UpdateItem from './update-item'

test.group('update-item (use-case)', (group) => {
    const app = new InMemoryAppConfig()
    const useCase = new UpdateItem(app)

    group.each.teardown(() => app.clear())

    test('should update an item in collection', async ({ expect }) => {
        const workspace = await app.workspaceRepository.createFake()
        const collection = CollectionFactory.create()

        app.drive.createFile('.is/collections.json', JSON.stringify([collection]))

        const item = new Item({
            name: 'test',
        })

        app.drive.createFile(DirectoryEntry.normalize(collection.path, '.is', 'metas.json'), [item])
        app.drive.createDir(DirectoryEntry.normalize(collection.path, item.id))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
            data: {
                custom: 'update hello',
            },
        })

        const metas = await app.drive.readArray(
            DirectoryEntry.normalize(collection.path, '.is', 'metas.json')
        )

        const meta = metas.find((i) => i.id === item.id)

        expect(meta.custom).toEqual('update hello')
    })
})
