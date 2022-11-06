import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import CreateImporter from './create-importer'

test.group('create-importer (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    const memoryDrive = new InMemoryDrive()
    const drive = new DriveManager({ memory: memoryDrive }, 'memory')

    const useCase = new CreateImporter(repository, drive)

    test('should create a importer', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        await useCase.execute({
            workspaceId: workspace.id,
            data: {
                id: 'my-importer',
                content: 'export default (helloWord) => helloWord'
            }
        })

        const content = await memoryDrive.read('.is/importers/my-importer.js')

        expect(content).not.toBeNull()

        expect(content?.toString()).toEqual('export default (helloWord) => helloWord')
    })

    test('should throw an error if workspace was not found', async ({ expect }) => {
        expect.assertions(1)

        await useCase.execute({
            workspaceId: 'undefined',
            data: {
                content: '',
                id: ''
            },
        }).catch(err => expect(err.message).toEqual('Workspace not found'))
    })
})