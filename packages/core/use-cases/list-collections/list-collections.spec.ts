import { test } from '@japa/runner'

import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import CollectionFactory from '../../__tests__/factories/collections'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListCollections from './list-collections'

test.group('list-collections (use-case)', (group) => {
    const repository = new InMemoryWorkspaceRepository()    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new ListCollections(repository, drive)

    group.tap(t => t.teardown(() => memoryDrive.clear()))

    test('should return a list of collections of the workspace', async ({ expect }) => {
        const collections = CollectionFactory.createMany()

        memoryDrive.createFile('.index-san/collections.json', collections)

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        const result = await useCase.execute({
            workspaceId: workspace.id
        })

        expect(result.data.length).toEqual(collections.length)
    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'invalid',
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should return an empty array if collections.json not exist', async ({expect}) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        const result = await useCase.execute({
            workspaceId: workspace.id
        })

        expect(result.data.length).toEqual(0)
    })

})