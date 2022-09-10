import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import DeleteCollection from './delete-collection'

test.group('delete-collection (use-case)', (group) => {
    const repository = new InMemoryWorkspaceRepository()    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new DeleteCollection(repository, drive)

    group.tap(t => t.teardown(() => memoryDrive.clear()))

    test('should delete a collection in workspace', async ({ expect }) => {
        const collection = CollectionFactory.create()

        const entry = DirectoryEntry.file('.index-san/collections.json')

        memoryDrive.createFile(entry.path, [collection])

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            collectionId: collection.id,
        })

        const content = memoryDrive.content.get('.index-san/collections.json')

        const json = content ? JSON.parse(content.toString()) : []
        
        expect(json.length).toEqual(0)

    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)
        
        const collection = CollectionFactory.create()

        await useCase.execute({
            workspaceId: 'invalid',
            collectionId: collection.id,
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
        }).catch(err => expect(err.message).toEqual('Collection not found'))
    })

})