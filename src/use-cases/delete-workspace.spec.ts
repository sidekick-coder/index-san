import { test } from '@japa/runner'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import DeleteWorkspace from './delete-workspace'

test.group('use-case: delete-workspaces', () => {
  const repository = new InMemoryWorkspacesRepository()
  const deleteWorkspace = new DeleteWorkspace(repository)

  test('should list all workspaces', async ({ expect }) => {
    repository.workspaces = [
      {
        name: 'Root',
        displayName: 'Root',
        path: 'C:\\fake-path\\Root',
        id: '1',
      },
    ]

    await deleteWorkspace.execute('1')

    expect(repository.workspaces).toEqual([])
  })
})
