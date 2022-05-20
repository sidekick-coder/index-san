import { test } from '@japa/runner'
import InMemoryWorkspaceRepository from 'src/tests/repositories/InMemoryWorkspaceRepository'
import CreateWorkspace from './create-workspace'

test.group('create-workspace', () => {
  const repository = new InMemoryWorkspaceRepository()
  const createWorkspace = new CreateWorkspace(repository)

  test('should create a new workspace', async ({ expect }) => {
    await createWorkspace.execute({
      name: 'Root',
      displayName: 'Root',
      path: 'C:\\fake-path\\Root',
    })

    expect(repository.workspaces).toHaveLength(1)
  })
})
