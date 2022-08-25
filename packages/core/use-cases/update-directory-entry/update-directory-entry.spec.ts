import { test } from "@japa/runner";
import DirectoryEntry from "../../entities/directory-entry";
import DriveManager from "../../gateways/drive-manager";
import WorkspaceFactory from "../../__tests__/factories/workspace-factory";
import InMemoryDrive from "../../__tests__/gateways/in-memory-drive";
import InMemoryWorkspaceRepository from "../../__tests__/repositories/in-memory-workspace-repository";

import UpdateDirectoryEntry from "./update-directory-entry";

test.group('update-directory-entry (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')

    const useCase = new UpdateDirectoryEntry(repository, drive)

    test('should update an entry using drive', async ({ expect }) => {

        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))        

        const entry = new DirectoryEntry({
            name: 'text.txt',
            path: 'text.txt',
            type: 'file'
        })

        await drive.write(entry)
        
        await useCase.execute({
            workspaceId: workspace.id,
            path: entry.path,
            newPath: 'update.txt'
        })

        expect(memoryDrive.entries[0].path).toEqual('update.txt')
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
            path: entry.path,
            newPath: 'update.txt'
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
    
    test('should trigger an error if the entry not exist', async ({ expect }) => {
        expect.assertions(1)

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
            path: entry.path,
            newPath: 'update.txt'
        }).catch(err => expect(err.message).toEqual('DirectoryEntry not exists'))
    })

})