import { test } from '@japa/runner'
import DriveManager from '../../gateways/drive-manager'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryDrive from '../../__tests__/gateways/in-memory-drive'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import UpdateWorkspaceOptions from './update-workspace-options'


test.group('update-workspace-options (use-case)', () => {
    const memoryDrive = new InMemoryDrive()    
    const drive = new DriveManager({ memory: memoryDrive}, 'memory')
    const repository = new InMemoryWorkspaceRepository()

    const useCase = new UpdateWorkspaceOptions(repository, drive)

    test('should throw an error if workspace was not found', async ({ expect }) => {

        expect.assertions(1)
        
        await useCase.execute({ workspaceId: '999', data: {} }).catch(err => {
            expect(err.message).toEqual('Workspace not found')
        })

    })

    test('should return array of workspace options', async ({ expect }) => {
        const options = {
            hello: 'word'
        }

        memoryDrive.createFile('.is/options.json', options)

        const workspace = await repository.create(WorkspaceFactory.create())

        await useCase.execute({ workspaceId: workspace.id, data: {
            hello: 'update'
        }})

        const contents = await memoryDrive.read('.is/options.json')

        const result = contents ? JSON.parse(contents.toString()) : {}

        expect(result).toEqual({ hello: 'update' })
    })
})