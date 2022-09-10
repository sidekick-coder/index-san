import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import UpdateCollection from './update-collection'

test.group('update-collection (use-case)', (group) => {
    const repository = new InMemoryWorkspaceRepository()    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new UpdateCollection(repository, drive)

    group.tap(t => t.teardown(() => memoryDrive.clear()))

    test('should update a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        memoryDrive.createFile('.index-san/collections.json', JSON.stringify([collection]))

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
            data: {
                name: 'update-name'
            }
        })

        const content = memoryDrive.content.get('.index-san/collections.json')

        const json = content ? JSON.parse(content.toString()) : []
        
        expect(json[0].name).toEqual('update-name')

    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)
        
        const collection = CollectionFactory.create()

        await useCase.execute({
            workspaceId: 'invalid',
            collectionId: collection.id,
            data: {},
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should trigger an error if collection was not found', async ({expect}) => {
        expect.assertions(1)

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: 'invalid',
            data: {},
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })

})