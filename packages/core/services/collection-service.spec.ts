import { test } from '@japa/runner'
import Collection from '../entities/collection'
import DirectoryEntry from '../entities/directory-entry'
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

    function createCollection(data: Partial<Collection>) {
        return workspace.createCollection(CollectionFactory.create(data))
    }

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

    test('should return items with relations', async ({ expect }) => {
        const main = await CollectionService.from(workspace, collection.id)

        const relation = await createCollection({
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

        const parent = await app.memoryCrud.create(main.path, {
            id: 'parent-01',
        })

        await app.memoryCrud.create(relation.path, {
            id: 'child-01',
            parent: parent.id,
        })

        const result = await relation.list({
            include: ['relations'],
        })

        expect(result[0].parent).toBeDefined()

        expect(result[0].parent.id).toEqual(parent.id)
    })

    test('should return items with simple function executed', async ({ expect }) => {
        const collection = await createCollection({
            columns: [
                {
                    id: '1',
                    label: 'Message',
                    field: 'message',
                    type: 'script',
                    content: 'setResult(`${item.name} is a nice guy`)',
                },
            ],
        })

        await app.memoryCrud.create(collection.path, {
            id: '01',
            name: 'Will',
        })

        const result = await collection.list({
            include: ['scripts'],
        })

        expect(result[0].message.result).toEqual('Will is a nice guy')
    })

    test('should return items with complex function executed', async ({ expect }) => {
        const extract = await createCollection({
            id: 'extract',
            columns: [
                {
                    id: '1',
                    label: 'amount',
                    field: 'amount',
                    type: 'number',
                },
            ],
        })

        const collection = await createCollection({
            columns: [
                {
                    id: '1',
                    label: 'Sum',
                    field: 'sum',
                    type: 'script',
                    content: `
                        const items = await workspace.items('extract')

                        setResult('sum is: ' + String(items.sumBy('amount')))
                    `,
                },
            ],
        })

        await app.memoryCrud.create(extract.path, { id: '1', amount: 5 })
        await app.memoryCrud.create(extract.path, { id: '2', amount: 5 })
        await app.memoryCrud.create(extract.path, { id: '3', amount: 5 })

        await app.memoryCrud.create(collection.path, { id: '01' })

        const result = await collection.list({
            include: ['scripts'],
        })

        expect(result[0].sum.result).toBe(`sum is: 15`)
    })

    test('should return items with related entries', async ({ expect }) => {
        const collection = await createCollection({
            columns: [
                {
                    id: '1',
                    label: 'Thumbnail',
                    field: 'thumbnail',
                    type: 'entry',
                },
            ],
        })

        const entry = DirectoryEntry.file(collection.path, '01', 'thumbnail.jpg')

        await app.memoryCrud.create(collection.path, {
            id: '01',
            name: 'Will',
            thumbnail: entry.path,
        })

        app.memoryDrive.createFile(entry.path, Buffer.from([0]))

        const result = await collection.list({
            include: ['entries'],
        })

        expect(result[0].thumbnail).toEqual(entry)
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
