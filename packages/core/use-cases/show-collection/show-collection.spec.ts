import { test } from '@japa/runner'

import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ShowCollection from './show-collection'

test.group('show-collection (use-case)', (group) => {
    const repository = new InMemoryWorkspaceRepository()    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new ShowCollection(repository, drive)

    group.tap(t => t.teardown(() => memoryDrive.clear()))

    test('should return a collection by id', async ({ expect }) => {
        const collection = CollectionFactory.create()

        memoryDrive.createFile('.is/collections.json', [collection])

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        const result = await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id
        })

        expect(result.data).toEqual({
            ...collection,
            workspaceId: workspace.id,
        })
    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'invalid',
            collectionId: '2'
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should trigger an error if is an invalid collection', async ({expect}) => {
        expect.assertions(1)

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId:'invalid'
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })

})