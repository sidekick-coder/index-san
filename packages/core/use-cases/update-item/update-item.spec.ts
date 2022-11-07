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

import UpdateItem from './update-item'

test.group('update-item (use-case)', group => {
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
    
    
    const useCase = new UpdateItem(appService)
    
    const workspace = WorkspaceFactory.create({ drive: 'memory' })    
    const collection = CollectionFactory.create({ crudName: 'memory' })
    
    memoryCrud.drive = memoryDrive

    group.each.setup(() => {
        memoryDrive.createFile('.is/collections.json', JSON.stringify([collection]))
        workspaceRepository.createSync(workspace)
    })
    
    group.each.teardown(() => memoryDrive.clear())
    

    test('should update an item in collection', async ({ expect }) => {
        const item = await memoryCrud.create(collection.path, new Item({
            name: 'test',
            custom: 'hello word',
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id,
            data: {
                custom: 'update hello'
            }
        })

        const updated = await memoryCrud.findById(collection.path, item.id)

        expect(updated?.custom).toEqual('update hello')
    })
})