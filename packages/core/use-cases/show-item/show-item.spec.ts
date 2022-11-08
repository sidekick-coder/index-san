import { test } from '@japa/runner'
import Item from '../../entities/item'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import AppService from '../../services/app-service'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryCrud from '../../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ShowItem from './show-item'

test.group('show-item (use-case)', (group) => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const driveManager = new DriveManager({ memory: memoryDrive })    
    const crudManger = new CrudManager({ memory: memoryCrud  })
    const workspaceRepository = new InMemoryWorkspaceRepository()

    const appService = new AppService({
        workspaceRepository,
        driveManager,
        crudManger
    })
    
    const useCase = new ShowItem(appService)

    const workspace = WorkspaceFactory.create()    
    const collection = CollectionFactory.create()    
    
    group.each.setup(() => {
        memoryDrive.createFile('.is/collections.json', JSON.stringify([collection]))
        workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => memoryDrive.clear())
    
    test('should throw an error if item was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: ''
        }).catch(err => expect(err.message).toEqual('Item not found'))
    })
    

    test('should return item by id', async ({ expect }) => {
        const item = new Item({})

        memoryDrive.mkdir(`${collection.path}/${item.id}`)
        
        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id
        })

        expect(result.data).toEqual({
            id: item.id,
            workspaceId: workspace.id,
            collectionId: collection.id,
        })
    })
})