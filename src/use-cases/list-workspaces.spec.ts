import { test } from '@japa/runner'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ListWorkspaces from './list-workspaces'

test.group('use-case: list-workspaces', () => {
  const repository = new InMemoryWorkspacesRepository()
  const listWorkspaces = new ListWorkspaces(repository)

  test('should list all workspaces', async ({ expect }) => {
    repository.workspaces = [
      {
        name: 'Root',
        displayName: 'Root',
        path: 'C:\\fake-path\\Root',
        id: '1',
      },
    ]

    const workspaces = await listWorkspaces.execute()

    expect(workspaces).toEqual(repository.workspaces)
  })
})
