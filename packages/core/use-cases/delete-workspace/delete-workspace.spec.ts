import { test } from '@japa/runner'
import WorkspaceFactory from '../../__tests__/factories/workspace-factory'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import DeleteWorkspace from './delete-workspace'

test.group('delete-workspace (use-case)', () => {
    const repository = new InMemoryWorkspaceRepository()    
    const useCase = new DeleteWorkspace(repository)

    test('should delete workspace', async ({ expect }) => {

        const workspace = await repository.create(
            WorkspaceFactory.create()
        )

        await useCase.execute({ id: workspace.id })


        expect(repository.items.length).toEqual(0)

    })
})