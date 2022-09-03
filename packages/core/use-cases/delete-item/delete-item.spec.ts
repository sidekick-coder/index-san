import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import Item from '../../entities/item'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryCrud from '../../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'

import DeleteItem from './delete-item'

test.group('delete-item (use-case)', group => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const drive = new DriveManager({ memory: memoryDrive })    
    const crud = new CrudManager({ memory: memoryCrud  })
    
    const workspaceRepository = new InMemoryWorkspaceRepository()
    
    const useCase = new DeleteItem(drive, crud, workspaceRepository)
    
    const workspace = WorkspaceFactory.create({ drive: 'memory' })    
    const collection = CollectionFactory.create({ crudName: 'memory' })
    
    const entry = new DirectoryEntry({
        name: 'collections.json',
        path: '.index-san/collections.json',
        type: 'file'
    })
    
    memoryCrud.drive = memoryDrive

    group.each.setup(() => {
        memoryDrive.createSync(entry, Buffer.from(JSON.stringify([collection])))
        workspaceRepository.createSync(workspace)
    })
    
    group.each.teardown(() => memoryDrive.clear())
    

    test('should delete an item in collection', async ({ expect }) => {
        const item = await memoryCrud.create(collection.path, new Item({
            name: 'test',
            custom: 'hello word',
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            itemId: item.id
        })

        expect(memoryDrive.entries.length).toEqual(1)
        expect(memoryCrud.metas.length).toEqual(0)
    })
})