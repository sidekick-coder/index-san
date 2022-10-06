import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ShowWorkspaceOptions from './show-workspace-options'


test.group('show-workspace-options (use-case)', () => {
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')
    const repository = new InMemoryWorkspaceRepository()

    const useCase = new ShowWorkspaceOptions(repository, drive)

    test('should throw an error if workspace was not found', async ({ expect }) => {

        expect.assertions(1)
        
        await useCase.execute({ workspaceId: '999' }).catch(err => {
            expect(err.message).toEqual('Workspace not found')
        })

    })

    test('should return array of workspace options', async ({ expect }) => {
        const options = {
            theme: {
                accent: '#000',
                lines: '#eee'
            }
        }

        memoryDrive.createFile('.is/options.json', options)

        const workspace = await repository.create(WorkspaceFactory.create())

        const result = await useCase.execute({ workspaceId: workspace.id })

        expect(result.data).toEqual(options)
    })
})