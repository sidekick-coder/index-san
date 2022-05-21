import { test } from '@japa/runner'
import InMemoryWorkspaceRepository from 'src/tests/repositories/InMemoryWorkspaceRepository'
import DeleteWorkspace from './delete-workspace'

test.group('delete-workspaces', () => {
  const repository = new InMemoryWorkspaceRepository()
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
