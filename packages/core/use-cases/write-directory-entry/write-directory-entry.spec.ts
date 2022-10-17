import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import WriteDirectoryEntry from './write-directory-entry'

test.group('write-directory-entry (use-case', () => {
    const repository = new InMemoryWorkspaceRepository()
    const drive = new DriveManager({ memory: new InMemoryDrive() }, 'memory')

    const useCase = new WriteDirectoryEntry(repository, drive)

    test('should throw an error if workspace not exist', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'invalid',
            path: '22',
            data: Buffer.from('')
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })

    test('should throw an error if directory-entry not exist', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        expect.assertions(1)

        await useCase.execute({
            workspaceId: workspace.id,
            path: '22',
            data: Buffer.from('')
        }).catch(err => expect(err.message).toEqual('DirectoryEntry not found'))
    })

    test('should update entry with buffer', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await drive.write('test.txt', Buffer.from('Hello word'))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
            data: Buffer.from('update hello word')
        })

        const result =  await drive.read('test.txt')

        expect(result).toEqual(Buffer.from('update hello word'))
    })

    test('should update entry with ', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await drive.write('test.txt', Buffer.from('Hello word'))

        await useCase.execute({
            workspaceId: workspace.id,
            path: 'test.txt',
            data: 'update hello word'
        })

        const result =  await drive.read('test.txt')

        expect(result).toEqual(Buffer.from('update hello word'))
    })

})    