import { test } from '@japa/runner'
import ConfigFactory from 'src/__tests__/factories/ConfigFactory'
import WorkspaceFactory from 'src/__tests__/factories/WorkspaceFactory'
import InMemoryConfigsRepository from 'TestRepositories/InMemoryConfigsRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'
import ListConfig from './list-config'

test.group('use-case: list-config', () => {
  const workspaceRepository = new InMemoryWorkspacesRepository()
  const configsRepository = new InMemoryConfigsRepository()

  const workspaceFactory = new WorkspaceFactory(workspaceRepository)
  const configFactory = new ConfigFactory(configsRepository)

  const listConfig = new ListConfig(workspaceRepository, configsRepository)

  test('should list all workspaces', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    configsRepository.configs.push({
      name: 'test.txt',
      workspaceId: workspace.id,
      value: {
        test: 'test',
      },
    })

    const result = await listConfig.execute(workspace.id)

    expect(result).toEqual(configsRepository.configs)
  })

  test('should filter configs by name', async ({ expect }) => {
    const workspace = await workspaceFactory.create()

    const configs = await configFactory.createMany(workspace)

    const result = await listConfig.execute(workspace.id, {
      names: [configs[0].name],
    })

    expect(result).toHaveLength(1)

    expect(result).toEqual([configs[0]])
  })

  test('should throw an error if the workspace does not exist', async ({ expect }) => {
    await expect(listConfig.execute('non-existing')).rejects.toThrow(
      'Workspace with id non-existing not found'
    )
  })
})
