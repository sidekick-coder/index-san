import { test } from '@japa/runner'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'
import CreateWorkspace from './create-workspace'

test.group('use-case: create-workspace', () => {
  const repository = new InMemoryWorkspacesRepository()
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
