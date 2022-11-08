import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'

import CreateWorkspace from './create-workspace'

test.group('create-workspace (use-case)', () => {
    const repository = new InMemoryWorkspaceRepository()
    const drive = new DriveManager({ memory: new InMemoryDrive() }, 'memory')

    const useCase = new CreateWorkspace(repository, drive)
    
    test('should create a workspace', async ({ expect }) => {
        const workspace = WorkspaceFactory.create()
        
        await useCase.execute(workspace)

        const item = repository.items[0]

        expect(item.name).toEqual(workspace.name)        
        expect(item.driveName).toEqual(workspace.driveName)        
        expect(item.path).toEqual(workspace.path)
        
    })

    test('should throw an error if drive is invalid', async ({ expect }) => {
        expect.assertions(1)

        const workspace = WorkspaceFactory.create({
            driveName: 'invalid'
        })

        await useCase.execute(workspace).catch(err => expect(err.message).toEqual('Invalid drive'))
    })
    
})