import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import AppService from '../../services/app-service'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryCrud from '../../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'

import CreateItem from './create-item'

test.group('create-item (use-case)', group => {
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
    

    
    const useCase = new CreateItem(appService)

    const workspace = WorkspaceFactory.create({ drive: 'memory' })    
    const collection = CollectionFactory.create({ crudName: 'memory' })
    
    const entry = DirectoryEntry.file('.is/collections.json')
    
    group.each.setup(() => {
        memoryDrive.createFile(entry.path, [collection])
        workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => memoryDrive.clear())

    test('should create an item in collection', async ({ expect }) => {
        const { data } = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {}
        })

        expect(memoryDrive.entries[1].path).toEqual([collection.path, data.id].join('/'))
    })
})