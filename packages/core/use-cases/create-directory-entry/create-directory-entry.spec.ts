import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'

import CreateDirectoryEntry from './create-directory-entry'

test.group('create-directory-entry (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new CreateDirectoryEntry(repository, drive)

    test('should create a new entry using drive', async ({ expect }) => {

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))        

        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })
        
        await useCase.execute({
            workspaceId: workspace.id,
            data: entry
        })

        expect(memoryDrive.entries[0]).toEqual(entry)
    })

    test('should trigger an error if is an invalid workspace', async ({expect}) => {
        expect.assertions(1)
        
        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })

        await useCase.execute({
            workspaceId: 'invalid',
            data: entry
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should trigger an error if the entry filepath already exist', async ({ expect }) => {
        expect.assertions(1)

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))        
        
        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })

        await drive.create(entry)

        await useCase.execute({
            workspaceId: workspace.id,
            data: entry
        }).catch(err => expect(err.message).toEqual('DirectoryEntry already exists'))
    })

})