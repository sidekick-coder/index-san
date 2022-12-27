import { test } from '@japa/runner'
import InMemoryApp from '../../__tests__/app'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListWorkspaces from './list-workspaces'

test.group('list-workspaces (use-case)', () => {
    const repository = new InMemoryWorkspaceRepository()

    const app = new InMemoryApp()

    const useCase = new ListWorkspaces(app)

    test('should return a list of workspaces', async ({ expect }) => {
        const workspace = app.workspaceRepository.createFakeSync()

        await repository.create(workspace)

        const result = await useCase.execute({})

        expect(result.data).toEqual([workspace])
    })
})
