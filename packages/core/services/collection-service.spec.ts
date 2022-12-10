import { test } from '@japa/runner'
import Collection from '../entities/collection'
import Item from '../entities/item'
import InMemoryApp from '../__tests__/app'
import CollectionFactory from '../__tests__/factories/collections'
import WorkspaceFactory from '../__tests__/factories/workspace-factory'
import CollectionService from './collection-service'
import WorkspaceService from './workspace-service'

test.group('collection-service (service)', (group) => {
    let workspace: WorkspaceService
    let collection: Collection

    const app = new InMemoryApp()

    group.each.setup(async () => {
        collection = CollectionFactory.create()

        app.memoryDrive.createFile('.is/collections.json', [collection])

        const data = app.workspaceRepository.createSync(WorkspaceFactory.create())

        workspace = await WorkspaceService.from(app, data.id)

        return () => {
            app.clear()
        }
    })

    test('should trigger an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        await CollectionService.from(workspace, 'invalid').catch((err) =>
            expect(err.message).toEqual('Collection not found')
        )
    })

    test('should instantiate collection', async ({ expect }) => {
        app.memoryDrive.createFile('.is/collections.json', [collection])

        const service = await CollectionService.from(workspace, collection.id)

        expect(service.id).toBe(collection.id)
        expect(service.name).toBe(collection.name)
    })

    test('should list collection items', async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        app.memoryDrive.createDir([service.path, 'item-01'].join('/'))
        app.memoryDrive.createDir([service.path, 'item-02'].join('/'))
        app.memoryDrive.createDir([service.path, 'item-03'].join('/'))

        const result = await service.list()

        expect(result.length).toBe(3)
    })

    test('should return items with relations', async ({ expect }) => {
        const main = await CollectionService.from(workspace, collection.id)

        const relation = await main.workspace.createCollection(
            CollectionFactory.create({
                columns: [
                    {
                        id: '1',
                        label: 'Parent',
                        field: 'parent',
                        type: 'relation',
                        collectionId: main.id,
                    },
                ],
            })
        )

        const parent = await app.memoryCrud.create(main.path, {
            id: 'parent-01',
        })

        await app.memoryCrud.create(relation.path, {
            id: 'child-01',
            parent: parent.id,
        })

        const result = await relation.list()

        expect(result[0].parent).toBeDefined()

        expect(result[0].parent.id).toEqual(parent.id)
    })

    test('should returned items have workspaceId & collectionId defined', async ({ expect }) => {
        expect.assertions(40)

        const service = await CollectionService.from(workspace, collection.id)

        for (let i = 0; i < 20; i++) {
            app.memoryDrive.createDir([service.path, `item-${i}`].join('/'))
        }

        const result = await service.list()

        result.forEach((i) => expect(i.collectionId).toBeDefined())
        result.forEach((i) => expect(i.workspaceId).toBeDefined())
    })

    test('should return a collection by id', async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        const item = await app.memoryCrud.create(
            collection.path,
            new Item({
                message: 'hello word',
            })
        )

        const result = await service.show(item.id)

        expect(result).toEqual({
            id: item.id,
            message: item.message,
            collectionId: collection.id,
            workspaceId: workspace.id,
        })
    })

    test('should create an item', async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        await service.create({
            id: 'hello',
        })

        const result = await service.list()

        expect(result[0]).toEqual({
            id: 'hello',
            collectionId: collection.id,
            workspaceId: workspace.id,
        })
    })

    test('should update a item by id', async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        const item = await app.memoryCrud.create(
            collection.path,
            new Item({
                message: 'hello word',
            })
        )

        await service.update(item.id, {
            message: 'update hello',
        })

        const result = await service.show(item.id)

        expect(result.message).toBe('update hello')
    })

    test('should delete a item by id', async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        const item = await app.memoryCrud.create(
            collection.path,
            new Item({
                name: 'test',
                custom: 'hello word',
            })
        )

        await service.delete(item.id)

        const result = await service.list()

        expect(result.length).toBe(0)
    })
})
