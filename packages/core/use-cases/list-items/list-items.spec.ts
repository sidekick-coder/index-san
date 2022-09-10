import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryCrud from '../../__tests__/gateways/in-memory-crud'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListItems from './list-items'

test.group('list-items (use-case)', (group) => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const drive = new DriveManager({ memory: memoryDrive })    
    const crud = new CrudManager({ memory: memoryCrud  })
    const workspaceRepository = new InMemoryWorkspaceRepository()
    
    const useCase = new ListItems(drive, crud, workspaceRepository)

    const workspace = WorkspaceFactory.create({ drive: 'memory' })    
    const collection = CollectionFactory.create({ crudName: 'memory' })
    
    
    group.each.setup(() => {
        memoryDrive.write('.index-san/collections.json', Buffer.from(JSON.stringify([collection])))
        workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => memoryDrive.clear())

    

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'undefined',
            collectionId: ''
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should throw an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: 'undefined'
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })
    

    test('should return a list of items', async ({ expect }) => {
        for (let i = 0; i < 20; i++) {
            memoryDrive.mkdir(`${collection.path}/${i}`)
        }
        
        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id
        })

        expect(result.data.length).toEqual(20)
    })

    test('should returned items have workspaceId & collectionId defined', async ({ expect }) => {
        expect.assertions(40)

        for (let i = 0; i < 20; i++) {
            memoryDrive.mkdir(`${collection.path}/${i}`)
        }
        
        const { data } = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id
        })
        
        data.forEach(i => expect(i.collectionId).toBeDefined())
        data.forEach(i => expect(i.workspaceId).toBeDefined())
    })
})