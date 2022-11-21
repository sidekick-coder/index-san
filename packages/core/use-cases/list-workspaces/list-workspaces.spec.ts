import { test } from '@japa/runner'
import Workspace from '../../entities/workspace'
import InMemoryWorkspaceRepository from '../../__tests__/repositories/in-memory-workspace-repository'
import ListWorkspaces from './list-workspaces'

test.group('list-workspaces (use-case)', () => {
    const repository = new InMemoryWorkspaceRepository()
    const useCase = new ListWorkspaces(repository)

    test('should return a list of workspaces', async ({ expect }) => {
        const workspace = new Workspace({
            name: 'test',
            path: 'test',
            drive: 'local',
            config: {},
        })

        await repository.create(workspace)

        const result = await useCase.execute({})

        expect(result.data).toEqual([workspace])
    })
})
