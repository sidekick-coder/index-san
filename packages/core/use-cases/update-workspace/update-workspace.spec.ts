import { test } from '@japa/runner'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import UpdateWorkspace from './update-workspace'


test.group('update-workspace (use-case)', () => {

    const repository = new InMemoryWorkspaceRepository()
    const useCase = new UpdateWorkspace(repository)
    
    test('should update a workspace', async ({ expect }) => {
        const workspace = await repository.create(WorkspaceFactory.create())

        await useCase.execute({
            id: workspace.id,
            data: {
                name: 'update-workspace',
                config:{
                    app_key: '123'
                }
            }
        })

        const updated = await repository.findById(workspace.id)

        expect(updated?.name).toEqual('update-workspace')
        expect(updated?.config).toEqual({
            app_key: '123'
        })

    })
    
    test('should throw an error if workspace no exist', async ({ expect }) => {
        expect.assertions(1)

        const args = {
            id: 'no-exist',
            data: {
                name: 'update-workspace'
            }
        }

        await useCase.execute(args)
            .catch(err => expect(err.message).toEqual('Workspace not found'))
    })
})