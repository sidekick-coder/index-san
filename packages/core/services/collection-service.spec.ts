import { test } from '@japa/runner'
import Collection from '../entities/collection'
import Item from '../entities/item'
import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive-manager'
import CollectionFactory from '../__tests__/factories/collections'
import WorkspaceFactory from '../__tests__/factories/workspace-factory'
import InMemoryCrud from '../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../__tests__/repositories/in-memory-workspace-repository'
import AppService from './app-service'
import CollectionService from './collection-service'
import WorkspaceService from './workspace-service'

test.group('collection-service (service)', (group) => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const driveManager = new DriveManager({ memory: memoryDrive })    
    const crudManger = new CrudManager({ memory: memoryCrud  })
    const workspaceRepository = new InMemoryWorkspaceRepository()

    let workspace: WorkspaceService
    let collection: Collection

    group.each.setup(async () => {
        
        collection = CollectionFactory.create()
        
        memoryDrive.createFile('.is/collections.json', [collection])
        
        const data = workspaceRepository.createSync(WorkspaceFactory.create())

        workspace = await WorkspaceService.from(appService, data.id)


        return () => {
            workspaceRepository.clear()
            memoryDrive.clear()
        }
    })

    const appService = new AppService({
        workspaceRepository,
        driveManager,
        crudManger
    })

    test('should trigger an error if collection was not found',async ({ expect }) => {
        expect.assertions(1)

        await CollectionService.from(workspace, 'invalid')
            .catch(err => expect(err.message).toEqual('Collection not found'))
        
    })

    test('should instantiate collection',async ({ expect }) => {      

        memoryDrive.createFile('.is/collections.json', [collection])

        const service = await CollectionService.from(workspace, collection.id)

        expect(service.id).toBe(collection.id)
        expect(service.name).toBe(collection.name)        
    })
    
    test('should list collection items',async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        memoryDrive.createDir([service.path, 'item-01'].join('/'))
        memoryDrive.createDir([service.path, 'item-02'].join('/'))
        memoryDrive.createDir([service.path, 'item-03'].join('/'))

        const result = await service.list()

        expect(result.length).toBe(3)        
    })

    test('should returned items have workspaceId & collectionId defined', async ({ expect }) => {
        expect.assertions(40)
        
        const service = await CollectionService.from(workspace, collection.id)

        for (let i = 0; i < 20; i++) {
            memoryDrive.createDir([service.path, 'item-', i].join('/'))
        }
        
        const result = await service.list()
        
        result.forEach(i => expect(i.collectionId).toBeDefined())
        result.forEach(i => expect(i.workspaceId).toBeDefined())
    })

    test('should return a collection by id',async ({ expect }) => {
        const service = await CollectionService.from(workspace, collection.id)

        const item = await memoryCrud.create(collection.path, new Item({
            message: 'hello word',
        }))

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
            id: 'hello'
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

        const item = await memoryCrud.create(collection.path, new Item({
            message: 'hello word',
        }))

        await service.update(item.id, {
            message: 'update hello'
        })

        const result = await service.show(item.id)

        expect(result.message).toBe('update hello')        
    })
    
    test('should delete a item by id', async ({ expect }) => {
        
        const service = await CollectionService.from(workspace, collection.id)

        const item = await memoryCrud.create(collection.path, new Item({
            name: 'test',
            custom: 'hello word',
        }))

        await service.delete(item.id)

        const result = await service.list()

        expect(result.length).toBe(0)        
    })
})