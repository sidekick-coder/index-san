import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ShowDirectoryEntry from './show-directory-entry'


test.group('show-directory-entry (use-case', () => {
    const repository = new InMemoryWorkspaceRepository()
    const drive = new DriveManager({ memory: new InMemoryDrive() }, 'memory')

    const useCase = new ShowDirectoryEntry(repository, drive)


    test('should show a directory-entry', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await drive.write('test.txt', Buffer.from(''))


        const result = await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt'
        })

        expect(result.data).toEqual(DirectoryEntry.file('test.txt'))
    })
    
    test('should throw an error if workspace not exist', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'invalid',
            path: '22'
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })

    test('should throw an error if directory-entry not exist', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            path: '22'
        }).catch(err => expect(err.message).toEqual('DirectoryEntry not found'))
    })
})