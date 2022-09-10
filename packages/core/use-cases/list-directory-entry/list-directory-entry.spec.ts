import { test } from '@japa/runner'
import DirectoryEntry from '../../entities/directory-entry'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListDirectoryEntry from './list-directory-entry'

test.group('list-directory-entry (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    const memoryDrive = new InMemoryDrive()
    const drive = new DriveManager({ memory: memoryDrive }, 'memory')

    const useCase = new ListDirectoryEntry(repository, drive)

    test('should list a directory using workspace', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        memoryDrive.createFile('file-01.txt', '')
        memoryDrive.createFile('file-02.txt', '')
        memoryDrive.createFile('file-03.txt', '')

        const result = await useCase.execute({
            workspaceId: workspace.id
        })

        expect(result.data.length).toEqual(3)
    })

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'undefined'
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
})