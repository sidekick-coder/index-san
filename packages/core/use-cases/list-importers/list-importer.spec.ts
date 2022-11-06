import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListImporters from './list-importers'

test.group('list-importers (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    const memoryDrive = new InMemoryDrive()
    const drive = new DriveManager({ memory: memoryDrive }, 'memory')

    const useCase = new ListImporters(repository, drive)

    test('should list importers', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create({
            drive: drive.getCurrentDrive()
        }))

        memoryDrive.createFile('.is/importers/importer-01.js', 'export default () => {}')
        memoryDrive.createFile('.is/importers/importer-02.js', 'export default () => {}')
        memoryDrive.createFile('.is/importers/importer-03.js', 'export default () => {}')

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