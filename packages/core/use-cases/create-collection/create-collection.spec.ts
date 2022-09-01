import { test } from '@japa/runner'

import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import CreateCollection from './create-collection'

test.group('create-collection (use-case)', (group) => {
    const repository = new InMemoryWorkspaceRepository()    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new CreateCollection(repository, drive)

    group.tap(t => t.teardown(() => memoryDrive.clear()))

    test('should create a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            data: collection
        })

        const content = memoryDrive.content.get('.index-san/collections.json')

        const json = content ? JSON.parse(content.toString()) : []

        expect(json.length).toEqual(1)
        
        expect(json[0].path).toEqual(collection.path)

    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)
        
        const collection = CollectionFactory.create()

        await useCase.execute({
            workspaceId: 'invalid',
            data: collection,
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })

})