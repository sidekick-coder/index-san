import { test } from '@japa/runner'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'
import DeleteWorkspace from './DeleteWorkspace'

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
