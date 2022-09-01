import { test } from "@japa/runner";
import DirectoryEntry from "../../entities/directory-entry";
import Item from "../../entities/item";
import CrudManager from "../../gateways/crud-manager";
import DriveManager from "../../gateways/drive-manager";
import CollectionFactory from "../../__tests__/factories/collections";
import WorkspaceFactory from "../../__tests__/factories/workspace-factory";
import InMemoryCrud from "../../__tests__/gateways/in-memory-crud";
import InMemoryDrive from "../../__tests__/gateways/in-memory-drive";
import InMemoryWorkspaceRepository from "../../__tests__/repositories/in-memory-workspace-repository";
import ShowItem from "./show-item";

test.group('show-item (use-case)', (group) => {
    const memoryDrive = new InMemoryDrive()
    const memoryCrud = new InMemoryCrud()
    const drive = new DriveManager({ memory: memoryDrive })    
    const crud = new CrudManager({ memory: memoryCrud  })
    const workspaceRepository = new InMemoryWorkspaceRepository()
    
    const useCase = new ShowItem(drive, crud, workspaceRepository)

    const entry = new DirectoryEntry({
        name: 'collections.json',
        path: '.index-san/collections.json',
        type: 'file'
    })

    const workspace = WorkspaceFactory.create({ drive: 'memory' })    
    const collection = CollectionFactory.create({ crudName: 'memory' })
    
    
    group.each.setup(() => {
        memoryDrive.createSync(entry, Buffer.from(JSON.stringify([collection])))
        workspaceRepository.createSync(workspace)
    })

    group.each.teardown(() => memoryDrive.clear())

    

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'undefined',
            collectionId: '',
            itemId: ''
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should throw an error if collection was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: 'undefined',
            itemId: ''
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })
    
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

        memoryDrive.createSync({
            name: item.id,
            path: `${collection.path}/${item.id}`,
            type: 'directory'
        })
        
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